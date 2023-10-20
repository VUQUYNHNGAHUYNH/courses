"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileEdit } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

const ChaptersForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created");
      reset({ title: "" });
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  const sortedChapters = initialData.chapters.sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="space-y-6">
      <div className="font-medium">Chapters</div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-x-3 justify-start"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g. 'Unit 1'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>
        </Form>
      )}

      <div>
        {!sortedChapters.length && isCreating && "No chapters"}

        {sortedChapters.map((chapter) => (
          <div
            key={chapter.id}
            className="flex items-center justify-between rounded-md bg-slate-100 p-2 mb-3"
          >
            <p className="capitalize">{chapter.title}</p>
            {chapter.isFree && (
              <Badge variant="outline" className="bg-slate-500 text-white">
                Free
              </Badge>
            )}
            <FileEdit
              onClick={() => onEdit(chapter.id)}
              className="w-5 h-5 cursor-pointer hover:text-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChaptersForm;
