"use client";

import { Chapter, FillInExercise } from "@prisma/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash } from "lucide-react";

interface ChapterFillInProps {
  initialData: Chapter & { fillIn: FillInExercise[] | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  content: z.string().min(1),
  fillInWords: z.string().min(1),
});

const ChapterExercise = ({
  initialData,
  courseId,
  chapterId,
}: ChapterFillInProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fillInWords: "",
    },
  });

  const { reset } = form;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/exercises`,
        values
      );
      reset({ content: "", fillInWords: "" });
      toast.success("Exercise created");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/exercises/${id}`
      );
      toast.success("Exercise deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium">Chapter Exercises</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4 justify-center items-start w-full mt-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Type your content here." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fillInWords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fill in Words (separated by commas):</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type a list of words here."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="sm" type="submit">
            Create
          </Button>
        </form>
      </Form>

      {initialData.fillIn &&
        initialData.fillIn.length > 0 &&
        initialData.fillIn.map((item) => (
          <div key={item.id} className="text-sm mt-6 p-3 bg-gray-50 rounded-md">
            <div>{item.content}</div>
            <div className="mt-4">
              <p className="font-medium mb-2">
                List of words to fill in blanks:
              </p>
              <div className="flex flex-wrap gap-2">
                {item.fillInWords.split(",").map((word, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-white text-gray-800 rounded-md shadow-md"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
            {deletingId === item.id && (
              <div className="mt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {deletingId !== item.id && (
              <Button
                onClick={() => onDelete(item.id)}
                className="mt-2 text-red-500 hover:text-white hover:bg-red-400 transition"
                variant="outline"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
    </div>
  );
};

export default ChapterExercise;
