"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const categories = ["Listening", "Reading", "Writing", "Speaking"];

const formCourseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
});

type Input = z.infer<typeof formCourseSchema>;

const CourseForm = () => {
  const router = useRouter();

  const form = useForm<Input>({
    resolver: zodResolver(formCourseSchema),
    defaultValues: {
      title: "",
      category: "",
    },
  });

  const onSubmit = async (data: Input) => {
    try {
      const response = await axios.post("/api/courses", data);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("New course created");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="p-2 text-2xl font-semibold text-primary">
        Create a course
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-8 w-[70%] md:max-w-xl mt-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="title..."
                    {...field}
                    className="capitalize"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-4 justify-center mt-2">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button size="lg" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CourseForm;
