"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";

interface FormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

const TitleForm = ({ initialData, courseId }: FormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Image updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && initialData.imageUrl && (
            <>
              <FileEdit className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <FileUpload
          endpoint="courseImage"
          onChange={(url) => {
            if (url) {
              onSubmit({ imageUrl: url });
            }
          }}
        />
      )}

      {!isEditing && initialData.imageUrl && (
        <div className="relative aspect-video mt-4">
          <Image
            alt="Upload"
            fill
            className="object-contain rounded-md"
            src={initialData.imageUrl}
          />
        </div>
      )}
    </div>
  );
};

export default TitleForm;
