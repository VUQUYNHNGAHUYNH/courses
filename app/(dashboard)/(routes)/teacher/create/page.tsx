"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
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
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { formCourseSchema } from "@/app/validationSchema";
import { Badge } from "@/components/ui/badge";

const categories = ["Listening", "Reading", "Writing", "Speaking"];

type Input = z.infer<typeof formCourseSchema>;

const CreateCourse = () => {
  const router = useRouter();
  const [image, setImage] = useState<{ url: string }[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);

  const form = useForm<Input>({
    resolver: zodResolver(formCourseSchema),
    defaultValues: {
      title: "",
      price: 0,
      imageUrl: "",
      category: "",
      chapters: [],
    },
  });

  const onSubmit = async (data: Input) => {
    try {
      await axios.post("/api/courses", data);
      router.push("/teacher/chapter");
      toast.success("New course created");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div>Course setup</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 w-[70%] md:max-w-xl"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="price..." {...field} />
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

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="flex text-sm items-start">
                    <UploadButton<OurFileRouter>
                      endpoint="courseImage"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          setImage(res);
                          form.setValue("imageUrl", res[0].url);
                        }
                      }}
                      {...field}
                    />
                  </div>
                </FormControl>
                {image.length > 0 && (
                  <Link
                    href={image[0].url}
                    target="_blank"
                    className="text-sm text-slate-600"
                  >
                    {image[0].url}
                  </Link>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chapters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapters</FormLabel>
                <FormControl>
                  {chapters.map((chapter, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(`/teacher/chapter/${chapter}`)}
                    >
                      {chapter.isFree && (
                        <Badge
                          variant="outline"
                          className="bg-slate-500 text-white"
                        >
                          Free
                        </Badge>
                      )}
                    </div>
                  ))}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create a course</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourse;
