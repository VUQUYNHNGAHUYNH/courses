"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chapter, Quiz } from "@prisma/client";
import { Loader2, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface ChapterQuizProps {
  initialData: Chapter & { quiz: Quiz[] };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  word: z.string().min(1).max(255),
  meaning: z.string().min(1).max(255),
});

const ChapterQuiz = ({
  initialData,
  courseId,
  chapterId,
}: ChapterQuizProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
      meaning: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/quiz`,
        values
      );
      reset({ word: "", meaning: "" });
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/quiz/${id}`
      );
      toast.success("Quiz deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium">Chapter Quiz</div>
      <div className="flex flex-col gap-y-4 justify-center items-center mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-x-4 justify-start"
          >
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="new word" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meaning"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="meaning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="sm" type="submit" variant="outline">
              <Plus className="h-5 w-5 mr-1" />
              Add
            </Button>
          </form>
        </Form>

        <div className="mt-4 border p-4 w-full bg-slate-50 rounded-md">
          <p className="font-medium mb-2 text-center">Words lists</p>
          {initialData.quiz.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-around mb-2"
            >
              <div className="flex-1">
                <div className="text-sm space-x-2">
                  <span className="px-4">{index + 1}.</span>
                  <span className="font-medium">{item.word}:</span>
                  <span className="text-gray-800">{item.meaning}</span>
                </div>
              </div>
              {deletingId === item.id && (
                <div>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              <button
                onClick={() => onDelete(item.id)}
                className="ml-auto text-red-500 hover:text-red-700 transition"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterQuiz;
