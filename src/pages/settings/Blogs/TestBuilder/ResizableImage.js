import { Node } from "@tiptap/core";

export const InlineResizableImage = Node.create({
  name: "inlineImage",
  group: "inline",
  inline: true,
  draggable: true,

  addAttributes() {
    return {
      src: {},
      alt: { default: null },
      title: { default: null },
      // width is stored as a percentage of the available editor width
      width: { default: 50 },
      // height is kept for backward compatibility but sizing is driven by aspectRatio
      height: { default: null },
      aspectRatio: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { width = 50, height, aspectRatio, src, alt, title } = HTMLAttributes;
    const safeWidth = Math.min(Math.max(Number(width) || 50, 5), 100);
    const ratio =
      aspectRatio ||
      (height && width ? Number(width) / Number(height) : 1) ||
      1;

    return [
      "div",
      {
        style: `display:inline-block; width:${safeWidth}%; position:relative; vertical-align:middle; aspect-ratio:${ratio};`,
      },
      [
        "img",
        {
          src,
          alt,
          title,
          style: `width:100%; height:100%; object-fit:cover; border-radius:8px; display:block;`,
        },
      ],
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      let isResizing = false;
      let resizeHandle = null;
      let startX, startY, startWidthPx, startHeightPx;

      const MIN_WIDTH_PERCENT = 5;
      const MAX_WIDTH_PERCENT = 100;

      const container = document.createElement("span");
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.style.verticalAlign = "middle";

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "block";
      wrapper.style.transition = "none";
      wrapper.style.width = "100%";

      let aspectRatio =
        node.attrs.aspectRatio ||
        (node.attrs.width && node.attrs.height
          ? Number(node.attrs.width) / Number(node.attrs.height)
          : null) ||
        1;

      const clampPercent = (value) =>
        Math.min(MAX_WIDTH_PERCENT, Math.max(MIN_WIDTH_PERCENT, value || MIN_WIDTH_PERCENT));

      const getParentWidth = () => {
        const parentRect = container.parentElement?.getBoundingClientRect();
        if (parentRect?.width) return parentRect.width;

        const editorRect = editor?.view?.dom?.getBoundingClientRect();
        if (editorRect?.width) return editorRect.width;

        return null;
      };

      const pxToPercent = (px) => {
        const parentWidth = getParentWidth();
        if (!parentWidth) return clampPercent(px);
        return clampPercent((px / parentWidth) * 100);
      };

      const applySize = (widthPercent) => {
        const safeWidth = clampPercent(widthPercent);
        container.style.width = `${safeWidth}%`;
        container.style.maxWidth = "100%";
        wrapper.style.width = "100%";
        wrapper.style.height = "auto";
        wrapper.style.aspectRatio = aspectRatio ? `${aspectRatio}` : "1";
        wrapper.style.maxWidth = "100%";
        return safeWidth;
      };

      const persistAttrs = (nextAttrs) => {
        const pos = getPos();
        if (typeof pos !== "number") return;

        const hasChanges = Object.entries(nextAttrs).some(
          ([key, value]) => value !== node.attrs[key]
        );
        if (!hasChanges) return;

        const tr = editor.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          ...nextAttrs,
        });
        editor.view.dispatch(tr);
        editor.commands.focus();
      };

      const resolveInitialWidth = () => {
        const value = typeof node.attrs.width === "number" ? node.attrs.width : Number(node.attrs.width);
        if (!value) return 50;
        return value > MAX_WIDTH_PERCENT ? pxToPercent(value) : value;
      };

      let currentWidthPercent = applySize(resolveInitialWidth());

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.verticalAlign = "middle";
      img.style.maxWidth = "none";
      img.style.borderRadius = "8px";
      img.style.userSelect = "none";
      img.style.display = "block";
      img.style.pointerEvents = "none";
      img.draggable = false;

      const handleImgLoad = () => {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const naturalRatio = img.naturalWidth / img.naturalHeight;
        if (!naturalRatio || Math.abs(naturalRatio - aspectRatio) < 0.001) return;
        aspectRatio = naturalRatio;
        wrapper.style.aspectRatio = `${aspectRatio}`;
        persistAttrs({ width: currentWidthPercent, aspectRatio });
      };

      img.addEventListener("load", handleImgLoad);

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "×";
      deleteBtn.style.position = "absolute";
      deleteBtn.style.top = "4px";
      deleteBtn.style.right = "4px";
      deleteBtn.style.width = "24px";
      deleteBtn.style.height = "24px";
      deleteBtn.style.borderRadius = "50%";
      deleteBtn.style.border = "none";
      deleteBtn.style.background = "rgba(239, 68, 68, 0.9)";
      deleteBtn.style.color = "white";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.fontSize = "18px";
      deleteBtn.style.lineHeight = "1";
      deleteBtn.style.display = "none";
      deleteBtn.style.zIndex = "10";
      deleteBtn.title = "Delete image";

      deleteBtn._onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = getPos();
        if (typeof pos === "number") {
          const imageUrl = node.attrs.src;
          const tr = editor.state.tr.deleteRange(pos, pos + node.nodeSize);
          editor.view.dispatch(tr);

          const event = new CustomEvent("tiptap-image-deleted", {
            detail: { url: imageUrl },
          });
          window.dispatchEvent(event);
        }
      };
      deleteBtn.addEventListener("click", deleteBtn._onClick);

      // Resize handles
      const createHandle = (position, cursor) => {
        const handle = document.createElement("div");
        handle.style.position = "absolute";
        handle.style.width = "12px";
        handle.style.height = "12px";
        handle.style.background = "#3b82f6";
        handle.style.border = "2px solid white";
        handle.style.borderRadius = "50%";
        handle.style.cursor = cursor;
        handle.style.display = "none";
        handle.style.zIndex = "10";
        handle.dataset.position = position;

        switch (position) {
          case "left":
            handle.style.left = "-6px";
            handle.style.top = "50%";
            handle.style.transform = "translateY(-50%)";
            break;
          case "right":
            handle.style.right = "-6px";
            handle.style.top = "50%";
            handle.style.transform = "translateY(-50%)";
            break;
          case "top":
            handle.style.top = "-6px";
            handle.style.left = "50%";
            handle.style.transform = "translateX(-50%)";
            break;
          case "bottom":
            handle.style.bottom = "-6px";
            handle.style.left = "50%";
            handle.style.transform = "translateX(-50%)";
            break;
          case "top-left":
            handle.style.top = "-6px";
            handle.style.left = "-6px";
            break;
          case "top-right":
            handle.style.top = "-6px";
            handle.style.right = "-6px";
            break;
          case "bottom-left":
            handle.style.bottom = "-6px";
            handle.style.left = "-6px";
            break;
          case "bottom-right":
            handle.style.bottom = "-6px";
            handle.style.right = "-6px";
            break;
        }
        return handle;
      };

      const handles = {
        left: createHandle("left", "ew-resize"),
        right: createHandle("right", "ew-resize"),
        top: createHandle("top", "ns-resize"),
        bottom: createHandle("bottom", "ns-resize"),
        topLeft: createHandle("top-left", "nwse-resize"),
        topRight: createHandle("top-right", "nesw-resize"),
        bottomLeft: createHandle("bottom-left", "nesw-resize"),
        bottomRight: createHandle("bottom-right", "nwse-resize"),
      };

      Object.values(handles).forEach((h) => {
        container.appendChild(h);
        h._onMouseDown = (e) => onMouseDown(e, h);
        h.addEventListener("mousedown", h._onMouseDown);
      });

      // Show handles and delete button on hover
      container.addEventListener("mouseenter", () => {
        deleteBtn.style.display = "flex";
        deleteBtn.style.alignItems = "center";
        deleteBtn.style.justifyContent = "center";
        Object.values(handles).forEach((h) => (h.style.display = "block"));
      });
      container.addEventListener("mouseleave", () => {
        deleteBtn.style.display = "none";
        Object.values(handles).forEach((h) => (h.style.display = "none"));
      });

      // Resizing logic
      const onMouseDown = (e, handle) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        resizeHandle = handle;
        startX = e.clientX;
        startY = e.clientY;
        startWidthPx = container.getBoundingClientRect().width || wrapper.offsetWidth;
        startHeightPx = container.getBoundingClientRect().height || wrapper.offsetHeight;

        document.body.style.cursor = handle.style.cursor;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };

      const calculateWidthFromDrag = (position, dx, dy) => {
        const widthFromX = position.includes("right") ? startWidthPx + dx : startWidthPx - dx;
        const heightFromY = position.includes("bottom")
          ? startHeightPx + dy
          : startHeightPx - dy;

        switch (position) {
          case "left":
          case "right":
            return widthFromX;
          case "top":
          case "bottom":
            return heightFromY * aspectRatio;
          case "top-left":
          case "top-right":
          case "bottom-left":
          case "bottom-right":
            const widthFromHeight = heightFromY * aspectRatio;
            return Math.abs(dx) > Math.abs(dy) ? widthFromX : widthFromHeight;
          default:
            return startWidthPx;
        }
      };

      const onMouseMove = (e) => {
        if (!isResizing || !resizeHandle) return;

        const position = resizeHandle.dataset.position;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const { minWidthPx, maxWidthPx } = (() => {
          const parentWidth = getParentWidth();
          if (parentWidth) {
            return {
              minWidthPx: (MIN_WIDTH_PERCENT / 100) * parentWidth,
              maxWidthPx: (MAX_WIDTH_PERCENT / 100) * parentWidth,
            };
          }
          return {
            minWidthPx: 50,
            maxWidthPx: Math.max(startWidthPx, 50),
          };
        })();

        const rawWidthPx = calculateWidthFromDrag(position, dx, dy);
        const clampedWidthPx = Math.max(minWidthPx, Math.min(rawWidthPx, maxWidthPx));
        const newWidthPercent = pxToPercent(clampedWidthPx);
        currentWidthPercent = applySize(newWidthPercent);
      };

      const onMouseUp = () => {
        if (!isResizing) return;
        isResizing = false;
        resizeHandle = null;
        document.body.style.cursor = "default";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);

        persistAttrs({ width: currentWidthPercent, aspectRatio });
      };

      container.appendChild(wrapper);
      wrapper.appendChild(img);
      container.appendChild(deleteBtn);

      return {
        dom: container,
        update(updatedNode) {
          if (updatedNode.type !== node.type) return false;
          node = updatedNode;

          if (typeof updatedNode.attrs.aspectRatio === "number" && updatedNode.attrs.aspectRatio > 0) {
            aspectRatio = updatedNode.attrs.aspectRatio;
          }

          const nextWidth =
            typeof updatedNode.attrs.width === "number"
              ? updatedNode.attrs.width
              : Number(updatedNode.attrs.width) || currentWidthPercent;

          currentWidthPercent = applySize(nextWidth);
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt;
          img.title = updatedNode.attrs.title;
          return true;
        },
        destroy() {
          // Remove listeners
          img.removeEventListener("load", handleImgLoad);
          deleteBtn.removeEventListener("click", deleteBtn._onClick);
          Object.values(handles).forEach((h) => {
            h.removeEventListener("mousedown", h._onMouseDown);
          });
        },
      };
    };
  },
});
