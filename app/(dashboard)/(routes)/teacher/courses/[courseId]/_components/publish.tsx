"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/confirm-modal";
import { useConfettiStore } from "@/components/hooks/use-confetti-store";

interface PublishProps {
  disabled: boolean;
  courseId: string;
  isPublish: boolean;
}

const CoursePublish = ({ disabled, courseId, isPublish }: PublishProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const onClick = async () => {
    try {
      if (isPublish) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Chapter published");
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelte = async () => {
    try {
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Chapter deleted");
      router.refresh();
      router.push(`/teacher/courses/`);
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

export default CoursePublish;
