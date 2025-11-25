import React, { useRef, useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";

import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import { InlineResizableImage } from "./ResizableImage";
import video from "./Video";
import { ChartNode } from "./ChartNode";
import ChartComponent from "./ChartComponent";

import {
  useAddImageFileMutation,
  useDeleteImageFileMutation,
} from "@/redux/apiSlice";

import {
  Bold as BsTypeBold,
  Italic as BsTypeItalic,
  Underline as BsTypeUnderline,
  Strikethrough as BsTypeStrikethrough,
  List as BsListUl,
  ListOrdered as BsListOl,
  Image as BsImage,
  Table as BsTable,
  Link as BsLink45Deg,
  AlignLeft as BsTextLeft,
  AlignCenter as BsTextCenter,
  AlignRight as BsTextRight,
  AlignJustify as BsJustify,
  Code as BsCode,
  Quote as BsQuote,
  Undo as BsArrowCounterclockwise,
  Redo as BsArrowClockwise,
  ChevronDown as BsChevronDown,
  Smile as BsEmojiSmile,
  BarChart3 as BsBarChartFill,
} from "lucide-react";

import {
  Type as MdFormatColorText,
  PaintBucket as MdFormatColorFill,
} from "lucide-react";

import "./tiptap.css"; // Import the CSS file
import * as Dialog from "@radix-ui/react-dialog";
import ChartDialog from "./ChartDialog";
const TiptapEditor = ({
  content = "",
  onChange,
  onReady,
  editorInstance,
}) => {
  const [addImageFile] = useAddImageFileMutation();
  const [deleteImageFile] = useDeleteImageFileMutation();
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");
  const [editLinkDialogOpen, setEditLinkDialogOpen] = useState(false);
  const [editLinkURL, setEditLinkURL] = useState("");
  const [editLinkText, setEditLinkText] = useState("");
  const [linkPosition, setLinkPosition] = useState(null);
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const lastSyncedContentRef = useRef(content ?? "");

  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "👇",
    "☝️",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
    "✍️",
    "💪",
    "🦾",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "⭐",
    "🌟",
    "✨",
    "💫",
    "💥",
    "💦",
    "💨",
    "🔥",
    "☀️",
    "🌈",
    "⚡",
    "🎉",
    "🎊",
    "🎈",
    "🎁",
    "🏆",
    "🥇",
    "🥈",
    "🥉",
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🎾",
    "🏐",
    "🏉",
    "🎱",
    "🏓",
    "🏸",
    "🥊",
    "🎯",
  ];
  // tiptap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside",
          },
        },
        listItem: {},
      }),
      //  StarterKit.configure({
      //       heading: false, // disable StarterKit's built-in headings
      //     }),
      //      Heading.configure({
      //       levels: [1, 2, 3, 4, 5, 6],
      //     }),
      InlineResizableImage,
      video,
      ChartNode,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 w-[200px] my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-gray-300",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2 bg-gray-100 font-bold",
        },
      }),
      TextStyle,
      FontSize.configure({
        types: ["textStyle"],
      }),
    ],
    content: content ?? "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      lastSyncedContentRef.current = html;
      onChange && onChange(html);
    },
  });
  useEffect(() => {
    if (!editor) return;

    const incoming = content ?? "";
    const current = editor.getHTML();

    if (incoming === lastSyncedContentRef.current && incoming === current) {
      return;
    }

    if (incoming !== current) {
      queueMicrotask(() => {
        if (editor && editor.getHTML() !== incoming) {
          editor.commands.setContent(incoming);
        }
      });
    }

    lastSyncedContentRef.current = incoming;
  }, [content, editor]);

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor);
    }
  }, [editor, onReady]);
  // Listen for media deletion events (images and videos)
  useEffect(() => {
    const handleMediaDelete = async (event) => {
      const { url } = event.detail;

      try {
        const filename = url.split("/").pop();
        await deleteImageFile({ url: url }).unwrap();
        console.log("Media deleted successfully:", filename);
      } catch (error) {
        console.error("Failed to delete media:", error);
      }
    };

    // Listen for both image and video deletion events
    window.addEventListener("tiptap-image-deleted", handleMediaDelete);
    window.addEventListener("tiptap-video-deleted", handleMediaDelete);

    return () => {
      window.removeEventListener("tiptap-image-deleted", handleMediaDelete);
      window.removeEventListener("tiptap-video-deleted", handleMediaDelete);
    };
  }, [deleteImageFile]);
  // upload media
  const handleMediaUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await addImageFile(formData).unwrap();
        const url = res?.data;
        const ext = file.type;

        if (!url) return;

        if (ext.startsWith("image/")) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "inlineImage",
              attrs: {
                src: url,
                title: file.name,
                width: 100,
                height: null,
              },
            })
            .run();
        }

        if (ext.startsWith("video/")) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "video",
              attrs: {
                src: url,
                controls: true,
              },
            })
            .run();
        }
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        e.target.value = "";
      }
    },
    [editor, addImageFile]
  );
  // add chart
  const handleInsertChart = (chartConfig) => {
    if (!editor) {
      console.log("Editor not ready");
      return;
    }

    // console.log("Inserting chart with config:", chartConfig);

    editor
      .chain()
      .focus()
      .insertContent({
        type: "chartNode",
        attrs: {
          chartType: chartConfig.chartType,
          title: chartConfig.title,
          data: chartConfig.data,
          isLive: chartConfig.isLive,
          updateInterval: chartConfig.updateInterval,
        },
      })
      .run();
  };
  // colors
  const setTextColor = useCallback(
    (color) => {
      editor.chain().focus().setColor(color).run();
    },
    [editor]
  );

  const setHighlightColor = useCallback(
    (color) => {
      editor.chain().focus().setHighlight({ color }).run();
    },
    [editor]
  );
  // fonts
  const setFontSize = useCallback(
    (size) => {
      if (size === "default") {
        editor.chain().focus().unsetFontSize().run();
      } else {
        editor.chain().focus().setFontSize(size).run();
      }
    },
    [editor]
  );
  // insert emoji
  const insertEmoji = useCallback(
    (emoji) => {
      editor?.chain().focus().insertContent(emoji).run();
      setShowEmojiPicker(false);
    },
    [editor]
  );
  // edit link
  useEffect(() => {
    if (!editor) return;

    const handleClick = (event) => {
      const target = event.target;

      if (target.tagName === "A" && target.href) {
        event.preventDefault();

        const url = target.getAttribute("href");
        const text = target.textContent;

        setEditLinkURL(url);
        setEditLinkText(text);
        setEditLinkDialogOpen(true);

        const pos = editor.view.posAtDOM(target, 0);
        setLinkPosition(pos);
      }
    };

    const handleSelectionUpdate = ({ editor }) => {
      if (editor.isActive("link")) {
        const attrs = editor.getAttributes("link");
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);

        setEditLinkURL(attrs.href);
        setEditLinkText(text);
        setEditLinkDialogOpen(true);
        setLinkPosition(from);
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("click", handleClick);

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editorElement.removeEventListener("click", handleClick);
      editor.off("selectionUpdate", handleSelectionUpdate); // الطريقة الصحيحة لإلغاء الاشتراك
    };
  }, [editor]);

  const updateLink = () => {
    if (!editLinkURL || !editLinkText || linkPosition === null) return;

    const { state, view } = editor;
    const { doc, tr } = state;

    // ابحث عن الـ link node
    let linkNode = null;
    let linkPos = null;

    doc.descendants((node, pos) => {
      if (node.marks.some((mark) => mark.type.name === "link")) {
        const linkMark = node.marks.find((mark) => mark.type.name === "link");
        if (pos <= linkPosition && pos + node.nodeSize >= linkPosition) {
          linkNode = node;
          linkPos = pos;
          return false;
        }
      }
    });

    if (linkNode && linkPos !== null) {
      // احذف الـ link القديم وأضف الجديد
      const transaction = tr
        .deleteRange(linkPos, linkPos + linkNode.nodeSize)
        .insertText(editLinkText, linkPos)
        .addMark(
          linkPos,
          linkPos + editLinkText.length,
          editor.schema.marks.link.create({
            href: editLinkURL,
            target: "_blank",
          })
        );

      view.dispatch(transaction);
    }

    // نظف الـ states
    setEditLinkDialogOpen(false);
    setEditLinkURL("");
    setEditLinkText("");
    setLinkPosition(null);
    editor.commands.focus();
  };
  //  remove link
  const removeLink = () => {
    if (linkPosition === null) return;

    const { state, view } = editor;
    const { doc, tr } = state;

    let linkPos = null;
    let linkNode = null;

    doc.descendants((node, pos) => {
      if (node.marks.some((mark) => mark.type.name === "link")) {
        if (pos <= linkPosition && pos + node.nodeSize >= linkPosition) {
          linkNode = node;
          linkPos = pos;
          return false;
        }
      }
    });

    if (linkNode && linkPos !== null) {
      const transaction = tr.removeMark(
        linkPos,
        linkPos + linkNode.nodeSize,
        editor.schema.marks.link
      );
      view.dispatch(transaction);
    }

    setEditLinkDialogOpen(false);
    setEditLinkURL("");
    setEditLinkText("");
    setLinkPosition(null);
    editor.commands.focus();
  };

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, children, title, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[40px] ${
        active
          ? "bg-blue-500 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-8 bg-gray-300 mx-1"></div>;

  return (
    <div className="w-full border border-gray-300 rounded-xl bg-white shadow-lg overflow-hidden h-[calc(100%-25px)]">
      {/* Main Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap items-center gap-2 bg-gradient-to-b from-gray-50 to-white">
        {/* Text Formatting Group */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <BsTypeBold size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <BsTypeItalic size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <BsTypeUnderline size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <BsTypeStrikethrough size={18} />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Heading Dropdown */}
        <div className="relative bg-white rounded-lg shadow-sm">
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().setHeading({ level }).run();
              }
            }}
            value={
              editor.isActive("heading", { level: 1 })
                ? 1
                : editor.isActive("heading", { level: 2 })
                  ? 2
                  : editor.isActive("heading", { level: 3 })
                    ? 3
                    : editor.isActive("heading", { level: 4 })
                      ? 4
                      : editor.isActive("heading", { level: 5 })
                        ? 5
                        : editor.isActive("heading", { level: 6 })
                          ? 6
                          : 0
            }
            className="px-3 py-2 pr-8 border-0 rounded-lg bg-white text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="0">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>
        </div>

        <Divider />

        {/* Font Size Dropdown */}
        <div className="relative group bg-white rounded-lg shadow-sm">
          <button
            type="button"
            className="px-3 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium text-sm text-gray-700"
            title="Font Size"
          >
            <span className="font-bold">A</span>
            <BsChevronDown size={12} />
          </button>

          <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-10 min-w-[120px]">
            {[
              { label: "Default", value: "default" },
              { label: "12px", value: "12px" },
              { label: "14px", value: "14px" },
              { label: "16px", value: "16px" },
              { label: "18px", value: "18px" },
              { label: "20px", value: "20px" },
              { label: "24px", value: "24px" },
              { label: "28px", value: "28px" },
              { label: "32px", value: "32px" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFontSize(opt.value)}
                className="w-full px-3 py-2 rounded-md text-left hover:bg-blue-50 text-sm transition"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* Lists Group */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <BsListUl size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <BsListOl size={18} />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Alignment Group */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <BsTextLeft size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <BsTextCenter size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <BsTextRight size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <BsJustify size={18} />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Colors Group */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          {/* Text Color */}
          <div className="relative group">
            <button
              type="button"
              className="p-2.5 rounded-lg hover:bg-gray-100 transition flex items-center justify-center min-w-[40px]"
              title="Text Color"
            >
              <MdFormatColorText size={20} className="text-gray-700" />
            </button>

            <div className="hidden group-hover:grid absolute top-full left-0  bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-10 grid-cols-7 gap-2">
              {[
                "#000000",
                "#434343",
                "#666666",
                "#999999",
                "#B7B7B7",
                "#FF0000",
                "#FF9900",
                "#FFFF00",
                "#00FF00",
                "#00FFFF",
                "#0000FF",
                "#9900FF",
                "#FF00FF",
                "#FF6B6B",
                "#FFA500",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setTextColor(color)}
                  className="w-7 h-7 rounded-md border-2 border-gray-300 hover:border-blue-500 transition-all hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Highlight Color */}
          <div className="relative group">
            <button
              type="button"
              className="p-2.5 rounded-lg hover:bg-gray-100 transition flex items-center justify-center min-w-[40px]"
              title="Highlight Color"
            >
              <MdFormatColorFill size={20} className="text-gray-700" />
            </button>

            <div className="hidden group-hover:grid absolute top-full left-0  bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-10 grid-cols-6 gap-2">
              {[
                "#FFFF00",
                "#00FF00",
                "#00FFFF",
                "#FF00FF",
                "#FFA500",
                "#FFB6C1",
                "#E6F3FF",
                "#FFE6E6",
                "#E6FFE6",
                "#FFF5E6",
                "#F0E6FF",
                "#E6FFFF",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setHighlightColor(color)}
                  className="w-7 h-7 rounded-md border-2 border-gray-300 hover:border-blue-500 transition-all hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* Insert Group */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          {/* Chart Button */}
          <ToolbarButton
            onClick={() => setChartDialogOpen(true)}
            title="Insert Chart"
          >
            <BsBarChartFill size={18} />
          </ToolbarButton>

          {/* Chart Dialog */}
          <ChartDialog
            open={chartDialogOpen}
            onOpenChange={setChartDialogOpen}
            onInsert={handleInsertChart}
          />

          {/* LINK BUTTON WITH DIALOG */}
          <ToolbarButton
            onClick={() => setLinkDialogOpen(true)}
            active={editor.isActive("link")}
            title="Add Link"
          >
            <BsLink45Deg size={20} />
          </ToolbarButton>
          <Dialog.Root open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
              <Dialog.Title className="text-lg font-semibold mb-2">
                Insert Link
              </Dialog.Title>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="URL"
                  value={linkURL}
                  onChange={(e) => setLinkURL(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Display Text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setLinkDialogOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!linkURL || !linkText) return;
                    editor
                      .chain()
                      .focus()
                      .insertContent(
                        `<a href="${linkURL}" target="_blank">${linkText}</a>`
                      )
                      .run();
                    setLinkDialogOpen(false);
                    setLinkURL("");
                    setLinkText("");
                  }}
                  className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Insert
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root
            open={editLinkDialogOpen}
            onOpenChange={setEditLinkDialogOpen}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96 z-50">
              <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800">
                Edit Link
              </Dialog.Title>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={editLinkURL}
                    onChange={(e) => setEditLinkURL(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Text
                  </label>
                  <input
                    type="text"
                    placeholder="Click here"
                    value={editLinkText}
                    onChange={(e) => setEditLinkText(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-2 mt-6">
                <button
                  onClick={removeLink}
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition"
                >
                  Remove Link
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditLinkDialogOpen(false);
                      setEditLinkURL("");
                      setEditLinkText("");
                      setLinkPosition(null);
                    }}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateLink}
                    className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
          <label
            className="p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer transition flex items-center justify-center min-w-[40px]"
            title="Upload Image/Video"
          >
            <BsImage size={18} className="text-gray-700" />
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleMediaUpload}
            />
          </label>

          <ToolbarButton
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            title="Insert Table"
          >
            <BsTable size={18} />
          </ToolbarButton>

          {/* Emoji Picker */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              active={showEmojiPicker}
              title="Insert Emoji"
            >
              <BsEmojiSmile size={18} />
            </ToolbarButton>

            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div className="absolute top-full -left-[250px] mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl p-3 z-20 w-80 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-10 gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="text-2xl hover:bg-gray-100 rounded p-1 transition-all hover:scale-125"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Divider />

        {/* Block Formatting Group */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Quote"
          >
            <BsQuote size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <BsCode size={18} />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Undo/Redo Group */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <BsArrowCounterclockwise size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <BsArrowClockwise size={18} />
          </ToolbarButton>
        </div>
      </div>

      {/* Table Controls - Enhanced */}
      {editor.isActive("table") && (
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-3 bg-blue-50">
          <span className="text-sm font-semibold text-blue-900 mr-2">
            Table Controls:
          </span>
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-blue-50 transition text-gray-700"
              title="Add Row After"
            >
              + Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-blue-50 transition text-gray-700"
              title="Add Row Before"
            >
              ↑ Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-red-50 transition text-red-600"
              title="Delete Row"
            >
              🗑️ Row
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-blue-50 transition text-gray-700"
              title="Add Column After"
            >
              + Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-blue-50 transition text-gray-700"
              title="Add Column Before"
            >
              ← Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-red-50 transition text-red-600"
              title="Delete Column"
            >
              🗑️ Col
            </button>
          </div>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-4 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 transition text-white font-medium shadow-sm"
            title="Delete Table"
          >
            🗑️ Delete Table
          </button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="p-6 min-h-[400px] tiptap-editor-content "
      />
    </div>
  );
};

export default TiptapEditor;
