import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";
import React from "react";
import { useImages } from "@/hooks/useImages";
import ImageOption from "./ImageOption";

// Normalization function for container names
const normalizeContainerName = (name: string) => {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9_.-]+/g, "_") // Replace invalid characters with '_'
};

interface ContainerFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  imageId: string | null;
  setImageId: (value: string) => void;
}

const ContainerForm: React.FC<ContainerFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  imageId,
  setImageId,
}) => {
  const { images } = useImages();

  const handleTitleChange = (value: string) => {
    setTitle(normalizeContainerName(value));
  };

  return (
    <>
      <FormInput title="Container Name" value={title} onChange={handleTitleChange} />

      <FormTextArea
        title="Description"
        value={description}
        onChange={setDescription}
      />

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

export default ContainerForm;

