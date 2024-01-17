"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getAvgTmp } from "@/lib/action";

import * as z from "zod";

export const formSchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => new Date(value) instanceof Date, {
      message: "Invalid 'from' date format. Expected format: YYYY-MM-DD",
    }),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => new Date(value) instanceof Date, {
      message: "Invalid 'to' date format. Expected format: YYYY-MM-DD",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Form() {
  const [isPending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { from: "", to: "" },
  });

  function submit(data: FormSchema) {
    startTransition(async () => {
      const result = await getAvgTmp(data.from, data.to);
      if (result.avgTmp !== undefined) {
        setResult(result.avgTmp);
      }
    });
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(submit)}>
      <div className="h-12 text-center font-bold text-7xl">
        {result !== null && `${result.toFixed(2)} °C`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block">from</label>
          <input
            type="text"
            {...register("from")}
            className="bg-transparent rounded-lg p-6 border border-pink-300"
          />
        </div>
        <div>
          <label className="block">to</label>
          <input
            type="text"
            {...register("to")}
            className="bg-transparent rounded-lg p-6 border border-pink-300"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          disabled={isPending || !isDirty}
          className="rounded-lg p-4 text-white bg-gradient-to-r from-blue-400 to-indigo-500 disabled:bg-gray-300"
        >
          Go!
        </button>
      </div>
    </form>
  );
}
