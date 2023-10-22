"use client";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Attachment, Chapter } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FileEdit, Loader2, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { toast } from "react-hot-toast";
import ReactPlayer from "react-player";
import Link from "next/link";

interface ChapterAttachmentProps {
  initialData: Chapter & { attachments?: Attachment[] };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const ChapterAttachment = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAttachmentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments`,
        values
      );
      toast.success("Attachment updated");
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
        `/api/courses/${courseId}/chapters/${chapterId}/attachments/${id}`
      );
      toast.success("Attachment deleted");
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
        Attachments
        <Button onClick={toggleEdit} variant="outline" size="sm">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <FileUpload
          endpoint="chapterAttachment"
          onChange={(url) => {
            if (url) {
              onSubmit({ url: url });
            }
          }}
        />
      )}

      {initialData.attachments && initialData.attachments.length === 0 && (
        <p className="text-sm mt-2 text-slate-600 italic">No attachments</p>
      )}

      {initialData.attachments && initialData.attachments.length > 0 && (
        <div>
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center text-primary bg-sky-50 p-2 w-full border rounded-md mt-2"
            >
              <Link href={attachment.url} target="_blank">
                <p className="text-sm">{attachment.url}</p>
              </Link>
              {deletingId === attachment.id && (
                <div>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {deletingId !== attachment.id && (
                <button
                  onClick={() => onDelete(attachment.id)}
                  className="ml-auto hover:text-red-500 transition"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterAttachment;
