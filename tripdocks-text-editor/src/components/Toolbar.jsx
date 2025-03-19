import React from "react";
import { FaBold, FaItalic, FaStrikethrough, FaListUl, FaUndo, FaRedo, FaHeading, FaCode } from "react-icons/fa";

const Toolbar = ({ editor }) => {
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
        style={{
          padding: "6px 10px",
          background: editor.isActive("bold") ? "#e6f7ff" : "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={{
          padding: "6px 10px",
          background: editor.isActive("italic") ? "#e6f7ff" : "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={{
          padding: "6px 10px",
          background: editor.isActive("strike") ? "#e6f7ff" : "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={{
          padding: "6px 10px",
          background: editor.isActive("heading", { level: 1 }) ? "#e6f7ff" : "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaHeading />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={{
          padding: "6px 10px",
          background: editor.isActive("bulletList") ? "#e6f7ff" : "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        style={{
          padding: "6px 10px",
          background: "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        style={{
          padding: "6px 10px",
          background: "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaRedo />
      </button>
      <button
        onClick={() => editor.chain().focus().insertContent("{{ ").run()}
        style={{
          padding: "6px 10px",
          background: "white",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <FaCode /> Insert Variable
      </button>
    </div>
  );
};

export default Toolbar;