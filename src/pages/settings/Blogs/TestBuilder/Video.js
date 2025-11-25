// extensions/Video.js
import { Node, mergeAttributes } from '@tiptap/core';

const Video = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      width: {
        default: 640,
      },
      height: {
        default: 360,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      // Main container
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.margin = '16px 0';
      container.style.maxWidth = '100%';

      // Video element
      const video = document.createElement('video');
      video.src = node.attrs.src;
      video.controls = node.attrs.controls;
      video.width = node.attrs.width;
      video.height = node.attrs.height;
      video.style.display = 'block';
      video.style.maxWidth = '100%';
      video.style.borderRadius = '8px';
      video.style.border = '2px solid transparent';
      video.style.transition = 'border-color 0.2s';
      video.style.backgroundColor = '#000';

      // Resize handle overlay
      const resizeOverlay = document.createElement('div');
      resizeOverlay.style.position = 'absolute';
      resizeOverlay.style.bottom = '0';
      resizeOverlay.style.right = '0';
      resizeOverlay.style.width = '20px';
      resizeOverlay.style.height = '20px';
      resizeOverlay.style.cursor = 'nwse-resize';
      resizeOverlay.style.background = 'rgba(59, 130, 246, 0.8)';
      resizeOverlay.style.borderRadius = '4px 0 8px 0';
      resizeOverlay.style.display = 'none';
      resizeOverlay.style.zIndex = '5';
      resizeOverlay.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="pointer-events: none;">
          <path d="M14 6L6 14M10 6L6 10M14 10L10 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '×';
      deleteBtn.type = 'button';
      deleteBtn.style.position = 'absolute';
      deleteBtn.style.top = '8px';
      deleteBtn.style.right = '8px';
      deleteBtn.style.width = '32px';
      deleteBtn.style.height = '32px';
      deleteBtn.style.borderRadius = '50%';
      deleteBtn.style.border = 'none';
      deleteBtn.style.background = 'rgba(239, 68, 68, 0.95)';
      deleteBtn.style.color = 'white';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.fontSize = '22px';
      deleteBtn.style.lineHeight = '1';
      deleteBtn.style.display = 'none';
      deleteBtn.style.alignItems = 'center';
      deleteBtn.style.justifyContent = 'center';
      deleteBtn.style.zIndex = '10';
      deleteBtn.style.fontWeight = 'bold';
      deleteBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      deleteBtn.title = 'Delete video';

      // Hover effects for delete button
      deleteBtn.addEventListener('mouseenter', () => {
        deleteBtn.style.background = 'rgba(220, 38, 38, 1)';
        deleteBtn.style.transform = 'scale(1.1)';
      });

      deleteBtn.addEventListener('mouseleave', () => {
        deleteBtn.style.background = 'rgba(239, 68, 68, 0.95)';
        deleteBtn.style.transform = 'scale(1)';
      });

      // Show controls on hover
      container.addEventListener('mouseenter', () => {
        deleteBtn.style.display = 'flex';
        resizeOverlay.style.display = 'block';
        video.style.borderColor = 'rgba(59, 130, 246, 0.5)';
      });

      container.addEventListener('mouseleave', () => {
        deleteBtn.style.display = 'none';
        resizeOverlay.style.display = 'none';
        video.style.borderColor = 'transparent';
      });

      // Handle delete
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const pos = getPos();
        if (typeof pos === 'number') {
          const videoUrl = node.attrs.src;
          
          // Delete from editor
          const tr = editor.state.tr.deleteRange(pos, pos + node.nodeSize);
          editor.view.dispatch(tr);
          
          // Dispatch custom event for backend deletion
          const event = new CustomEvent('tiptap-video-deleted', {
            detail: { url: videoUrl }
          });
          window.dispatchEvent(event);
        }
      });

      // Resizing logic
      let isResizing = false;
      let startX, startY, startWidth, startHeight;

      const onMouseDown = (e) => {
        if (e.target !== resizeOverlay) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = video.width;
        startHeight = video.height;
        
        document.body.style.cursor = 'nwse-resize';
        document.body.style.userSelect = 'none';
        
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };

      const onMouseMove = (e) => {
        if (!isResizing) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Maintain aspect ratio
        const aspectRatio = startWidth / startHeight;
        let newWidth = Math.max(200, startWidth + dx);
        let newHeight = newWidth / aspectRatio;
        
        // Limit maximum size
        const maxWidth = container.parentElement?.offsetWidth || 1200;
        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = newWidth / aspectRatio;
        }
        
        video.width = newWidth;
        video.height = newHeight;
      };

      const onMouseUp = () => {
        if (!isResizing) return;
        
        isResizing = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        const pos = getPos();
        if (typeof pos === 'number') {
          const { state } = editor;
          const tr = state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            width: video.width,
            height: video.height,
          });
          editor.view.dispatch(tr);
          editor.commands.focus();
        }
      };

      resizeOverlay.addEventListener('mousedown', onMouseDown);

      // Prevent video playback when clicking for resize/delete
      video.addEventListener('click', (e) => {
        if (resizeOverlay.style.display === 'block') {
          e.preventDefault();
        }
      });

      container.appendChild(video);
      container.appendChild(resizeOverlay);
      container.appendChild(deleteBtn);

      return {
        dom: container,
        destroy() {
          resizeOverlay.removeEventListener('mousedown', onMouseDown);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        },
      };
    };
  },
});

export default Video;
