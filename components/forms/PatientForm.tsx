/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import CustomeFormField from "@/components/CustomFormField"

import {Form} from "@/components/ui/form"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"

export enum FormFieldType {
  INPUT = 'input',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}

function getGreeting() {
  const currentHour = new Date().getHours(); 
  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning!";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon!";
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = "Good Evening!";
  } else {
    greeting = "Good Night!";
  }

  return greeting;
}



const PatientForm = () => {
  const [isLoading, setIsloading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  async function onSubmit({name, email,phone}: z.infer<typeof UserFormValidation>) {
   
    setIsloading(true)

    try {
      const userdata = {
        name,
        email,
        phone,
      } 
      // const user = await createUser(userdata)

      // if (user) {
      //   router.push(`/patients/${user.$id}/register`)
      // }
      
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">{getGreeting()} 👋</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>
        <CustomeFormField
          fieldType={FormFieldType.INPUT} control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomeFormField
          fieldType={FormFieldType.INPUT} control={form.control}
          name="email"
          label="Email"
          placeholder="email@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomeFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="254 700000000"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
)

}


  export default PatientForm