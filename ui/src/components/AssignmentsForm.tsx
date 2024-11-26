import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";
import React from "react";
import { useImages } from "@/hooks/useImages";
import ImageOption from "./ImageOption";
import FormDateTimeInput from "./FormDateTimeInput";

interface AssignmentFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueAt: string;
  setDueAt: (value: string) => void;
  imageId: string | null;
  setImageId: (value: string) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  dueAt: dueAt,
  setDueAt: setDueAt,
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
