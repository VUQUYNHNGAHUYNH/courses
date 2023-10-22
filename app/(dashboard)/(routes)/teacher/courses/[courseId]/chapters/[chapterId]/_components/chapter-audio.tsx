"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Audio, Chapter, Video } from "@prisma/client";
import {
  FileEdit,
  Loader2,
  PlaySquare,
  Plus,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface ChapterAudioFormProps {
  initialData: Chapter & { audio: Audio[] | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const ChapterAudio = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAudioFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/audio`,
        values
      );
      toast.success("Audio updated");
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
        `/api/courses/${courseId}/chapters/${chapterId}/audio/${id}`
      );
      toast.success("Audio deleted");
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
        Chapter Audio
        <Button onClick={toggleEdit} variant="outline" size="sm">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add a audio
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <FileUpload
          endpoint="chapterAudio"
          onChange={(url) => {
            if (url) {
              onSubmit({ url: url });
            }
          }}
        />
      )}
      {initialData.audio && initialData.audio.length > 0 && (
        <div>
          {initialData.audio.map((item) => (
            <div key={item.id} className="flex gap-x-4 mt-4">
              <AudioPlayer src={item.url} />
              {deletingId === item.id && (
                <div>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {deletingId !== item.id && (
                <div className=" flex justify-center items-center">
                  <Button
                    onClick={() => onDelete(item.id)}
                    className="mt-4 text-red-500 hover:text-white hover:bg-red-400 transition"
                    variant="outline"
                    size="sm"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterAudio;
