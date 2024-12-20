import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";
import React from "react";
import LabeledToggleSwitch from "./LabeledToggleSwitch";
import { useImages } from "@/hooks/useImages";
import ImageOption from "./ImageOption";
import FormDateTimeInput from "./FormDateTimeInput";

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
  publishAt: publishAt,
  setPublishAt: setPublishAt,
  dueAt: dueAt,
  setDueAt: setDueAt,
  lockAt: lockAt,
  setLockAt: setLockAt,
  unlockAt: unlockAt,
  setUnlockAt: setUnlockAt,
  allowsLateSubmissions,
  setAllowsLateSubmissions,
  imageId,
  setImageId,
}) => {
  const { images } = useImages();
  const [isVisibleBeforeRelease, setIsVisibleBeforeRelease] =
    React.useState(false);
  const [isPublishedLater, setIsPublishedLater] = React.useState(false);

  return (
    <>
      <FormInput title="Assignment Name" value={title} onChange={setTitle} />

      <FormTextArea
        title="Description"
        value={description}
        onChange={setDescription}
      />

      <FormDateTimeInput title="Due at" value={dueAt} onChange={setDueAt} />

      <LabeledToggleSwitch
        title="Publish later"
        value={isPublishedLater}
        onChange={() => {
          setIsPublishedLater(!isPublishedLater);
          if (!isPublishedLater) {
            const timezoneOffset = new Date().getTimezoneOffset() * 60000;
            setPublishAt(new Date(Date.now() - timezoneOffset).toISOString());
          }
        }}
      />

      {isPublishedLater && (
        <FormDateTimeInput
          title="Publish at"
          value={publishAt}
          onChange={setPublishAt}
          defaultTime={"00:00"}
        />
      )}

      <LabeledToggleSwitch
        title="Make visible before releasing"
        value={isVisibleBeforeRelease}
        onChange={() => {
          setIsVisibleBeforeRelease(!isVisibleBeforeRelease);
          if (!isVisibleBeforeRelease) {
            const timezoneOffset = new Date().getTimezoneOffset() * 60000;
            setUnlockAt(new Date(Date.now() - timezoneOffset).toISOString());
          }
        }}
      />

      {isVisibleBeforeRelease && (
        <FormDateTimeInput
          title="Unlock at"
          value={unlockAt}
          onChange={setUnlockAt}
          defaultTime="00:00"
        />
      )}

      <LabeledToggleSwitch
        title="Allow late submissions"
        value={allowsLateSubmissions}
        onChange={() => {
          setAllowsLateSubmissions(!allowsLateSubmissions);
          if (!allowsLateSubmissions) {
            const timezoneOffset = new Date().getTimezoneOffset() * 60000;
            setLockAt(new Date(Date.now() - timezoneOffset).toISOString());
          }
        }}
      />

      {allowsLateSubmissions && (
        <FormDateTimeInput
          title="Lock at"
          value={lockAt}
          onChange={setLockAt}
          defaultTime="23:59"
        />
      )}

      <h2>Image</h2>
      <div className="pt-2 pb-8">
        <select
          title="Image"
          value={imageId ?? ""}
          onChange={(e) => setImageId(e.target.value)}
          className="border rounded p-1 bg-surface"
        >
          <option value={-1}>Select an image</option>
          {images.map((image) => (
            <ImageOption key={image.docker_image_id} image={image} />
          ))}
        </select>
      </div>
    </>
  );
};

export default AssignmentForm;
