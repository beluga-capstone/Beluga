import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";
import FormDateInput from "./FormDateInput";
import React, { useState } from "react";
import LabeledToggleSwitch from "./LabeledToggleSwitch";
import { useImages } from "@/hooks/useImages";
import { useImageData } from "@/hooks/useImageData";
import ImageOption from "./ImageOption";

interface AssignmentFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  publishAt: string;
  setPublishAt: (value: string) => void;
  dueAt: string;
  setDueAt: (value: string) => void;
  lockAt: string;
  setLockAt: (value: string) => void;
  unlockAt: string;
  setUnlockAt: (value: string) => void;
  allowsLateSubmissions: boolean;
  setAllowsLateSubmissions: (value: boolean) => void;
  imageId: string | null;
  setImageId: (value: string) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  publishAt,
  setPublishAt,
  dueAt,
  setDueAt,
  lockAt,
  setLockAt,
  unlockAt,
  setUnlockAt,
  allowsLateSubmissions,
  setAllowsLateSubmissions,
}) => {
  const { images } = useImages();
  const [isVisibleBeforeRelease, setIsVisibleBeforeRelease] =
    React.useState(false);
  const [isPublishedLater, setIsPublishedLater] = React.useState(false);
  const [imageId, setImageId] = useState<string | null>(null);

  return (
    <>
      <FormInput title="Assignment Name" value={title} onChange={setTitle} />

      <FormTextArea
        title="Description"
        value={description}
        onChange={setDescription}
      />

      <FormDateInput title="Due at" value={dueAt} onChange={setDueAt} />

      <LabeledToggleSwitch
        title="Publish later"
        value={isPublishedLater}
        onChange={() => {
          setIsPublishedLater(!isPublishedLater);
          if (!isPublishedLater) {
            setPublishAt(new Date().toISOString());
          }
        }}
      />

      {isPublishedLater && (
        <FormDateInput
          title="Publish at"
          value={publishAt}
          onChange={setPublishAt}
        />
      )}

      <LabeledToggleSwitch
        title="Make visible before releasing"
        value={isVisibleBeforeRelease}
        onChange={() => {
          setIsVisibleBeforeRelease(!isVisibleBeforeRelease);
          if (!isVisibleBeforeRelease) {
            setUnlockAt(new Date().toISOString());
          }
        }}
      />

      {isVisibleBeforeRelease && (
        <FormDateInput
          title="Unlock at"
          value={unlockAt}
          onChange={setUnlockAt}
        />
      )}

      <LabeledToggleSwitch
        title="Allow late submissions"
        value={allowsLateSubmissions}
        onChange={() => {
          setAllowsLateSubmissions(!allowsLateSubmissions);
          if (!allowsLateSubmissions) {
            setLockAt(new Date().toISOString());
          }
        }}
      />

      {allowsLateSubmissions && (
        <FormDateInput title="Lock at" value={lockAt} onChange={setLockAt} />
      )}

      <h2>Image</h2>
      <div className="pt-2 pb-8">
        <select
        title="Image"
        value={imageId ?? ""}
        onChange={(e) => setImageId(e.target.value || null)}
        className="border rounded p-1 bg-surface"
      >
        <option value="">Select an image</option>
        {images.map((image) => (
          <option key={image.docker_image_id} value={image.docker_image_id}>
            {image.description}
          </option>
        ))}
      </select>
      </div>
    </>
  );
};

export default AssignmentForm;
