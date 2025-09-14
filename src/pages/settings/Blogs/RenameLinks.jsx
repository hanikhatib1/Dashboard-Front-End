import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

const RenameLinks = ({ rename_links, setRenameLinks }) => {
  const [links, setLinks] = useState(rename_links || []);
  const [newLink, setNewLink] = useState({ link: "", rename: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSaveClick = () => {
    if (newLink.link && newLink.rename) {
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      setRenameLinks(updatedLinks);
      setNewLink({ link: "", rename: "" });
      setIsAdding(false);
    }
  };

  const handleCancelClick = () => {
    setNewLink({ link: "", rename: "" });
    setIsAdding(false);
  };

  const handleDeleteClick = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    setRenameLinks(updatedLinks);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-body text-[#80838E]">Rename Links</h3>
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="text"
            value={link.link}
            readOnly
            className="rounded-[8px] h-[48px]"
          />
          <Input
            type="text"
            value={link.rename}
            readOnly
            className="rounded-[8px] h-[48px]"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteClick(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Link"
            value={newLink.link}
            onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
            className="rounded-[8px] h-[48px]"
          />
          <Input
            type="text"
            placeholder="Rename"
            value={newLink.rename}
            onChange={(e) => setNewLink({ ...newLink, rename: e.target.value })}
            className="rounded-[8px] h-[48px]"
          />
          <Button
            onClick={handleSaveClick}
            className="text-white bg-primary rounded-[8px]"
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancelClick}
            className="text-white bg-primary rounded-[8px]"
          >
            Cancel
          </Button>
        </div>
      )}
      {!isAdding && (
        <Button
          onClick={handleAddClick}
          className="w-fit text-white bg-primary rounded-[8px]"
        >
          Add Rename Link
        </Button>
      )}
    </div>
  );
};

export default RenameLinks;
