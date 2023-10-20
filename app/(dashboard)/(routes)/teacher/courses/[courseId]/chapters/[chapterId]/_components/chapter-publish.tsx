"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/confirm-modal";

interface ChapterPublishProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublish: boolean;
}

const ChapterPublish = ({
  disabled,
  courseId,
  chapterId,
  isPublish,
}: ChapterPublishProps) => {
  const router = useRouter();

  const onClick = async () => {
    try {
      if (isPublish) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter published");
      }

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelte = async () => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter deleted");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onClick} disabled={disabled} size="sm">
        {isPublish ? "UnPublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={onDelte}>
        <Button size="sm" variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterPublish;
