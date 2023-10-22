"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { FileEdit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Course } from "@prisma/client";
import { useState } from "react";
import { formatPrice } from "@/lib/format-price";

interface FormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ initialData, courseId }: FormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: initialData.price || undefined },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Price updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Price
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <FileEdit className="h-4 w-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-x-4 justify-start items-center w-full"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" step="10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={!isValid || isSubmitting}
            >
              <Save className="h-5 w-5 mr-1" type="submit" />
            </Button>
          </form>
        </Form>
      ) : (
        <p>{initialData.price ? formatPrice(initialData.price) : "No price"}</p>
      )}
    </div>
  );
};

export default PriceForm;
