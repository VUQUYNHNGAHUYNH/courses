"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Video } from "@prisma/client";
import { Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
  initialData: Chapter & { video: Video[] | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const ChapterVideo = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/video`,
        values
      );
      toast.success("Video updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/video/${id}`
      );
      toast.success("Video deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="outline">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add a video
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <FileUpload
          endpoint="chapterVideo"
          onChange={(url) => {
            if (url) {
              onSubmit({ url: url });
            }
          }}
        />
      )}
      {initialData.video && initialData.video.length > 0 && (
        <div>
          {initialData.video.map((item) => (
            <div key={item.id} className="flex flex-col gap-y-2 mt-6">
              <video src={item.url} controls></video>

              {deletingId !== item.id && (
                <Button
                  onClick={() => onDelete(item.id)}
                  className="ml-auto text-red-500 hover:text-white hover:bg-red-400 transition"
                  variant="outline"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
              {deletingId === item.id && (
                <div>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterVideo;
