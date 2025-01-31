import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Login } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react"


const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email must be valid email.",
    })
    .trim()
    .min(1, "Email cannot be empty"),
  password: z.string().trim().min(1, "Password cannot be empty"),
});

const LoginForm = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    setIsLoading(true)
    try {
      const response = await Login({ data })

      if (response.status === "success") {
        Cookies.set("auth_session", response.data.token, {
          expires: 1,
        })
        form.reset()
        toast.success("Login successful")
        navigate("/")
      }
    } catch (error) {
      console.error("Error logging in user:", error)
      toast.error("Login failed. Please check your email and password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="text-start">
          <CardTitle className="text-xl">Selamat Datang</CardTitle>
          <CardDescription>
            Silahkan login untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="py-5"
                        placeholder="m@example.com"
                        {...field}
                        type="text"
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="py-5"
                        placeholder="*********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full p-6"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default LoginForm