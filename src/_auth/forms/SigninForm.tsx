import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { SigninValidation } from "@/lib/validation"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"



const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();


  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 

 async function onSubmit(values: z.infer<typeof SigninValidation>) {
   const session = await signInAccount({
    email: values.email,
    password: values.password
   })

   if(!session) {
    return toast({
      title: "User account not created."
    })
   }

   const isLoggedIn = await checkAuthUser();

   if(isLoggedIn) {
    form.reset();
    navigate("/");
   } else {
    return toast({title: "Somenthing wrong try again later."})
   }
}

 
   
   
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome, Back!</p>
       
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input type="pemail" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password:</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
          {isUserLoading ? (
            <div className="flex-center gap-2">
             <Loader /> Loading...
            </div>
          ): "Log In"}
          </Button>

          <p className="text-small-regular text-light-2 text-center">
            Dont have an account ?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Register</Link>
          </p>
      </form>
      </div>
    </Form> 
  )
}

export default SigninForm

