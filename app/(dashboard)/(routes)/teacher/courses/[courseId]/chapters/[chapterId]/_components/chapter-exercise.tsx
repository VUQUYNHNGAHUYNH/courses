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
    <div className="py-8">
      <div className="font-medium">Chapter Exercises</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-8 flex flex-col gap-y-4 justify-center items-start w-full"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl className="w-full">
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
          <div key={item.id}>
            {item.content}
            <p className="font-medium">List of words to fill in blanks:</p>
            {item.fillInWords.split(",").map((word, index) => (
              <div key={index}>{word}</div>
            ))}
            {deletingId === item.id && (
              <div>
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {deletingId !== item.id && (
              <button
                onClick={() => onDelete(item.id)}
                className="ml-auto hover:text-red-500 transition"
              >
                <Trash className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default ChapterExercise;
