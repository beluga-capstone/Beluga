import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";
import FormDateInput from "./FormDateInput";
import React from "react";
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

  //useEffect(()=>{
  //  console.log("due changed to ",dueAt);
  //},[dueAt]);

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
          value={imageId}
          onChange={(e) => setImageId(e.target.value)} 
          className="border rounded p-1 bg-surface"
        >
          <option value={-1}>Select an image</option>
          {images.map((image) => (
            <ImageOption image={image}/>
          ))}
        </select>
      </div>
    </>
  );
};

export default AssignmentForm;
