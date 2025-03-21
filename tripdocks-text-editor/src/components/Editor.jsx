import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import jsPDF from "jspdf";
import TurndownService from "turndown";
import { VariableExtension } from "../extensions/variableExtensions"; // Single import
import { renderVariables } from "../extensions/variable";
import Toolbar from "./Toolbar";

const Editor = () => {
  const editorRef = useRef(null);

  const getInitialContent = () => {
    const storedContent = localStorage.getItem("editorContent");
    try {
      if (storedContent && typeof storedContent === "string" && storedContent.trim().startsWith("<")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(storedContent, "text/html");
        const paragraphs = doc.body.querySelectorAll("p");
        let validContent = "";
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) {
            validContent += p.outerHTML;
          }
        });
        return validContent || "<p>Start typing...</p>";
      }
      return "<p>Start typing...</p>";
    } catch (e) {
      console.error("Error parsing stored content, resetting:", e);
      return "<p>Start typing...</p>";
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "editor-heading",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "bullet-list",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "bullet-list-item",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "editor-paragraph",
          },
        },
      }),
      VariableExtension, // Use the combined extension
    ],
    content: getInitialContent(),
    editable: true,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      console.log("Editor updated - HTML content:", content);
      localStorage.setItem("editorContent", content);
    },
    onCreate: ({ editor }) => {
      console.log("Editor initialized with content:", editor.getHTML());
    },
    editorProps: {
      handleDOMEvents: {
        blur: (view, event) => {
          console.log("Blur detected, refocusing");
          setTimeout(() => {
            if (document.activeElement !== view.dom) {
              view.focus();
            }
          }, 0);
          return false;
        },
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
    if (editor && !editor.isFocused) {
      editor.commands.focus();
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, [editor]);

  const getEditorText = (editor) => {
    if (!editor) return "";
    const doc = editor.getJSON();
    let text = "";
    const traverseNode = (node) => {
      if (!node) return;
      if (node.type === "text" && node.text) {
        text += node.text;
      } else if (node.type === "variable" && node.attrs && node.attrs.value) {
        text += node.attrs.value;
      }
      if (node.content) {
        node.content.forEach(traverseNode);
      }
    };
    doc.content.forEach(traverseNode);
    return text || "";
  };

  const clearContent = () => {
    if (!editor) return;
    editor.commands.setContent("<p>Start typing...</p>");
    localStorage.setItem("editorContent", "<p>Start typing...</p>");
    editor.commands.focus();
  };

  const exportToPDF = (format = "raw") => {
    if (!editor) return;
    const doc = new jsPDF();
    let content = getEditorText(editor);
    if (format === "rendered") {
      content = renderVariables(content);
    }
    doc.text(content, 10, 10);
    doc.save(`editor-content-${format}.pdf`);
  };

  const exportToMarkdown = (format = "raw") => {
    if (!editor) return;
    const turndownService = new TurndownService();
    let content = format === "rendered" 
      ? `<p>${renderVariables(getEditorText(editor))}</p>` 
      : editor.getHTML();
    const markdown = turndownService.turndown(content);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `editor-content-${format}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          Email Template Editor
        </h2>
        <div className="text-sm text-gray-500">Last saved: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="mb-4">
        <Toolbar editor={editor} />
      </div>

      <div
        className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[300px] max-h-[500px] overflow-y-auto text-gray-800 text-base leading-relaxed focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200"
      >
        <EditorContent editor={editor} />
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button onClick={clearContent} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Clear
        </button>
        <div className="flex gap-3">
          <button onClick={() => exportToPDF("raw")} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-500 hover:to-teal-600">PDF (Raw)</button>
          <button onClick={() => exportToPDF("rendered")} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-600 hover:to-cyan-600">PDF (Rendered)</button>
          <button onClick={() => exportToMarkdown("raw")} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-600">Markdown (Raw)</button>
          <button onClick={() => exportToMarkdown("rendered")} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600">Markdown (Rendered)</button>
        </div>
      </div>
    </div>
  );
};

export default Editor;