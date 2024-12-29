/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
 
import CustomeFormField from "@/components/CustomFormField"

import {Form} from "@/components/ui/form"
import SubmitButton from "../SubmitButton"
import { PatientFormValidation, CreateAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { Doctors } from "@/constants"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import { z } from "zod"
import { useState } from "react"
export enum FormFieldType {
  INPUT = 'input',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}


const AppointmentForm = ({ userId, patientId, type }: {
  userId: string,
  patientId: string,
  type: 'create' | 'cancel' | 'schedule'
}) => {
  const [isLoading, setIsloading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: ""
    },
  })

   
  async function onSubmit(values: z.infer<typeof CreateAppointmentSchema>) {
    setIsloading(true);
  
    let status: 'scheduled' | 'cancelled' | 'pending' = 'pending'; // Set default status
  
    // Determine status based on the `type` (ensure `type` is correctly defined in the component's scope)
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
    }
  
    try {
      
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patientId, 
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule), 
          reason: values.reason,
          note: values.note,
          status: status as 'scheduled' | 'cancelled' | 'pending',
        };
      }
      const appointment = await CreateAppointmentSchema(appointmentData);
  
        
        if (appointment) {
          console.log("Appointment created:", appointment);
          
        }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsloading(false); // Reset loading state
      console.log("Loading state reset.");
    }
  }
  

  
  
  let buttonLabel

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment'
      break;
    case 'create':
      buttonLabel = 'Create Appointment'
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment'
    default:

  }
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New appointment 👋</h1>
          <p className="text-dark-700">Request a new appointment in 10 seconds</p>
        </section>

        {type !== 'cancel' && (
          <>
                 <CustomeFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a doctor"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
            </CustomeFormField>   
            <CustomeFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="Schedule"
              label="Expected appointed date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />  
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomeFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomeFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional notes"
                placeholder="Enter additional notes"
              />
            </div>
          
          </>
        )}

        {type === 'cancel' && (
          <CustomeFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="cancel"
            label="Cancel appointment"
            placeholder="Enter reason for cancellation"          
          />
        )}
        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{ buttonLabel }</SubmitButton>
      </form>
    </Form>
)

}


  export default AppointmentForm