import React, { useEffect, useState } from "react";
import { FaBold, FaItalic, FaStrikethrough, FaListUl, FaUndo, FaRedo, FaHeading, FaCode } from "react-icons/fa";

const Toolbar = ({ editor }) => {
  const [isHeadingActive, setIsHeadingActive] = useState(false);
  const [isListActive, setIsListActive] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateToolbarState = () => {
      setIsHeadingActive(editor.isActive("heading", { level: 1 }));
      setIsListActive(editor.isActive("bulletList"));
    };

    editor.on("selectionUpdate", updateToolbarState);
    editor.on("update", updateToolbarState);
    editor.on("transaction", updateToolbarState);

    return () => {
      editor.off("selectionUpdate", updateToolbarState);
      editor.off("update", updateToolbarState);
      editor.off("transaction", updateToolbarState);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "10px",
        padding: "8px",
        backgroundColor: "#f5f5f5",
        borderRadius: "5px",
        border: "1px solid #e0e0e0",
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        style={{ padding: "6px 10px", background: editor.isActive("bold") ? "#e6f7ff" : "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        style={{ padding: "6px 10px", background: editor.isActive("italic") ? "#e6f7ff" : "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        style={{ padding: "6px 10px", background: editor.isActive("strike") ? "#e6f7ff" : "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          editor.commands.focus(); // Ensure focus stays after toggle
        }}
        style={{ padding: "6px 10px", background: isHeadingActive ? "#e6f7ff" : "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}
      >
        <FaHeading />
      </button>
      <button
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
          editor.commands.focus(); // Ensure focus stays after toggle
        }}
        style={{ padding: "6px 10px", background: isListActive ? "#e6f7ff" : "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        style={{ padding: "6px 10px", background: "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: editor.can().undo() ? "pointer" : "not-allowed" }}
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        style={{ padding: "6px 10px", background: "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: editor.can().redo() ? "pointer" : "not-allowed" }}
      >
        <FaRedo />
      </button>
      <button
        onClick={() => editor.chain().focus().insertContent("{{ ").run()}
        style={{ padding: "6px 10px", background: "white", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}
      >
        <FaCode /> Insert Variable
      </button>
    </div>
  );
};

export default Toolbar;