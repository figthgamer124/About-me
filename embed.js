document.addEventListener("DOMContentLoaded", () => {
    let state = {
        content: "",
        embeds: [createEmptyEmbed()],
        buttons: []
    };
    let activeEmbedIndex = 0;

    function createEmptyEmbed() {
        return {
            authorName: "", authorURL: "", authorIcon: "",
            title: "", titleURL: "", description: "",
            color: "#5865f2", thumbnail: "", image: "",
            footerText: "", footerIcon: "", timestamp: false,
            fields: []
        };
    }

    const refs = {
        messageContent: document.getElementById("messageContent"),
        contentCount: document.getElementById("contentCount"),
        previewMessageContent: document.getElementById("previewMessageContent"),
        embedTabs: document.getElementById("embedTabs"),
        embedCount: document.getElementById("embedCount"),
        fieldCount: document.getElementById("fieldCount"),
        addEmbed: document.getElementById("addEmbed"),
        duplicateEmbed: document.getElementById("duplicateEmbed"),
        deleteEmbed: document.getElementById("deleteEmbed"),
        clearAllBtn: document.getElementById("clearAllBtn"),
        importBtn: document.getElementById("importBtn"),
        exportBtn: document.getElementById("exportBtn"),
        jsonFile: document.getElementById("jsonFile"),
        jsonViewer: document.getElementById("jsonViewer"),
        webhookUrl: document.getElementById("webhookUrl"),
        sendWebhookBtn: document.getElementById("sendWebhookBtn"),
        fieldsContainer: document.getElementById("fields"),
        addFieldBtn: document.getElementById("addField"),
        buttonsContainer: document.getElementById("buttons"),
        addButtonBtn: document.getElementById("addButton"),
        previewContainer: document.getElementById("previewContainer"),
        descriptionCount: document.getElementById("descriptionCount"),

        authorName: document.getElementById("authorName"),
        authorURL: document.getElementById("authorURL"),
        authorIcon: document.getElementById("authorIcon"),
        title: document.getElementById("title"),
        titleURL: document.getElementById("titleURL"),
        description: document.getElementById("description"),
        color: document.getElementById("color"),
        colorHex: document.getElementById("colorHex"),
        thumbnail: document.getElementById("thumbnail"),
        image: document.getElementById("image"),
        footerText: document.getElementById("footerText"),
        footerIcon: document.getElementById("footerIcon"),
        timestamp: document.getElementById("timestamp")
    };

    // Message Content Input Handler
    refs.messageContent.addEventListener("input", (e) => {
        state.content = e.target.value;
        refs.contentCount.textContent = e.target.value.length;
        renderPreview();
    });

    // Embed Form Input Handlers
    const inputs = ["authorName", "authorURL", "authorIcon", "title", "titleURL", "description", "thumbnail", "image", "footerText", "footerIcon"];
    inputs.forEach(id => {
        refs[id].addEventListener("input", (e) => {
            state.embeds[activeEmbedIndex][id] = e.target.value;
            if (id === "description") refs.descriptionCount.textContent = e.target.value.length;
            renderPreview();
        });
    });

    refs.timestamp.addEventListener("change", (e) => {
        state.embeds[activeEmbedIndex].timestamp = e.target.checked;
        renderPreview();
    });

    // Color Handling & Swatches
    refs.color.addEventListener("input", (e) => setColor(e.target.value));
    refs.colorHex.addEventListener("input", (e) => {
        let val = e.target.value;
        if (!val.startsWith("#")) val = "#" + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) setColor(val);
    });

    document.querySelectorAll(".swatch").forEach(swatch => {
        swatch.addEventListener("click", () => setColor(swatch.dataset.color));
    });

    function setColor(hex) {
        refs.color.value = hex;
        refs.colorHex.value = hex.toUpperCase();
        state.embeds[activeEmbedIndex].color = hex;
        renderPreview();
    }

    // Embed Management Tabs
    function renderTabs() {
        refs.embedTabs.innerHTML = "";
        refs.embedCount.textContent = state.embeds.length;
        state.embeds.forEach((_, idx) => {
            const btn = document.createElement("button");
            btn.className = `tab-btn ${idx === activeEmbedIndex ? "active" : ""}`;
            btn.textContent = `Embed ${idx + 1}`;
            btn.onclick = () => {
                activeEmbedIndex = idx;
                loadEmbedToForm();
                renderTabs();
                renderPreview();
            };
            refs.embedTabs.appendChild(btn);
        });
    }

    refs.addEmbed.onclick = () => {
        if (state.embeds.length >= 10) return alert("Discord allows max 10 embeds per message.");
        state.embeds.push(createEmptyEmbed());
        activeEmbedIndex = state.embeds.length - 1;
        loadEmbedToForm();
        renderTabs();
        renderPreview();
    };

    refs.duplicateEmbed.onclick = () => {
        if (state.embeds.length >= 10) return alert("Discord allows max 10 embeds per message.");
        const clone = JSON.parse(JSON.stringify(state.embeds[activeEmbedIndex]));
        state.embeds.push(clone);
        activeEmbedIndex = state.embeds.length - 1;
        loadEmbedToForm();
        renderTabs();
        renderPreview();
    };

    refs.deleteEmbed.onclick = () => {
        if (state.embeds.length <= 1) return alert("Message must contain at least 1 embed.");
        state.embeds.splice(activeEmbedIndex, 1);
        activeEmbedIndex = Math.max(0, activeEmbedIndex - 1);
        loadEmbedToForm();
        renderTabs();
        renderPreview();
    };

    refs.clearAllBtn.onclick = () => {
        if (confirm("Reset everything to empty state?")) {
            state = { content: "", embeds: [createEmptyEmbed()], buttons: [] };
            activeEmbedIndex = 0;
            refs.messageContent.value = "";
            refs.contentCount.textContent = "0";
            loadEmbedToForm();
            renderTabs();
            renderPreview();
        }
    };

    function loadEmbedToForm() {
        const embed = state.embeds[activeEmbedIndex];
        inputs.forEach(id => refs[id].value = embed[id] || "");
        setColor(embed.color || "#5865f2");
        refs.timestamp.checked = !!embed.timestamp;
        refs.descriptionCount.textContent = (embed.description || "").length;
        renderFields();
        renderButtons();
    }

    // Dynamic Fields
    refs.addFieldBtn.onclick = () => {
        const fields = state.embeds[activeEmbedIndex].fields;
        if (fields.length >= 25) return alert("Max 25 fields per embed.");
        fields.push({ name: "", value: "", inline: false });
        renderFields();
        renderPreview();
    };

    function renderFields() {
        refs.fieldsContainer.innerHTML = "";
        const fields = state.embeds[activeEmbedIndex].fields;
        refs.fieldCount.textContent = fields.length;
        fields.forEach((field, fIdx) => {
            const item = document.createElement("div");
            item.className = "field-item";
            item.innerHTML = `
                <button class="remove-btn" onclick="removeField(${fIdx})">&times;</button>
                <input type="text" placeholder="Field Name" value="${escapeHtml(field.name)}" oninput="updateField(${fIdx}, 'name', this.value)">
                <textarea placeholder="Field Value" oninput="updateField(${fIdx}, 'value', this.value)">${escapeHtml(field.value)}</textarea>
                <label class="checkbox">
                    <input type="checkbox" ${field.inline ? "checked" : ""} onchange="updateField(${fIdx}, 'inline', this.checked)"> Inline
                </label>
            `;
            refs.fieldsContainer.appendChild(item);
        });
    }

    window.updateField = (fIdx, key, val) => {
        state.embeds[activeEmbedIndex].fields[fIdx][key] = val;
        renderPreview();
    };

    window.removeField = (fIdx) => {
        state.embeds[activeEmbedIndex].fields.splice(fIdx, 1);
        renderFields();
        renderPreview();
    };

    // Dynamic Buttons
    refs.addButtonBtn.onclick = () => {
        if (state.buttons.length >= 5) return alert("Max 5 buttons per action row.");
        state.buttons.push({ label: "Button", style: "primary", url: "" });
        renderButtons();
        renderPreview();
    };

    function renderButtons() {
        refs.buttonsContainer.innerHTML = "";
        state.buttons.forEach((btn, bIdx) => {
            const item = document.createElement("div");
            item.className = "button-item";
            item.innerHTML = `
                <button class="remove-btn" onclick="removeButton(${bIdx})">&times;</button>
                <input type="text" placeholder="Button Label" value="${escapeHtml(btn.label)}" oninput="updateButton(${bIdx}, 'label', this.value)">
                <select onchange="updateButton(${bIdx}, 'style', this.value)">
                    <option value="primary" ${btn.style === 'primary' ? 'selected' : ''}>Primary (Blue)</option>
                    <option value="secondary" ${btn.style === 'secondary' ? 'selected' : ''}>Secondary (Gray)</option>
                    <option value="success" ${btn.style === 'success' ? 'selected' : ''}>Success (Green)</option>
                    <option value="danger" ${btn.style === 'danger' ? 'selected' : ''}>Danger (Red)</option>
                </select>
            `;
            refs.buttonsContainer.appendChild(item);
        });
    }

    window.updateButton = (bIdx, key, val) => {
        state.buttons[bIdx][key] = val;
        renderPreview();
    };

    window.removeButton = (bIdx) => {
        state.buttons.splice(bIdx, 1);
        renderButtons();
        renderPreview();
    };

    // Construct Payload Object
    function buildPayload() {
        return {
            content: state.content || undefined,
            embeds: state.embeds.map(e => ({
                title: e.title || undefined,
                description: e.description || undefined,
                url: e.titleURL || undefined,
                color: parseInt(e.color.replace("#", ""), 16) || undefined,
                author: e.authorName ? { name: e.authorName, url: e.authorURL || undefined, icon_url: e.authorIcon || undefined } : undefined,
                thumbnail: e.thumbnail ? { url: e.thumbnail } : undefined,
                image: e.image ? { url: e.image } : undefined,
                footer: e.footerText ? { text: e.footerText, icon_url: e.footerIcon || undefined } : undefined,
                timestamp: e.timestamp ? new Date().toISOString() : undefined,
                fields: e.fields.length > 0 ? e.fields.map(f => ({ name: f.name || "\u200b", value: f.value || "\u200b", inline: !!f.inline })) : undefined
            }))
        };
    }

    // Direct Webhook Post
    refs.sendWebhookBtn.onclick = async () => {
        const url = refs.webhookUrl.value.trim();
        if (!url) return alert("Please enter a Discord Webhook URL.");

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildPayload())
            });

            if (res.ok) alert("Message dispatched successfully via Webhook!");
            else alert(`Failed to send message: ${res.statusText}`);
        } catch (err) {
            alert("Error sending request to Webhook.");
        }
    };

    // Export/Import JSON
    refs.exportBtn.onclick = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(buildPayload(), null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "discohook-message.json");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    };

    refs.importBtn.onclick = () => refs.jsonFile.click();
    refs.jsonFile.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const parsed = JSON.parse(evt.target.result);
                state.content = parsed.content || "";
                refs.messageContent.value = state.content;
                refs.contentCount.textContent = state.content.length;

                const importedEmbeds = parsed.embeds || [parsed];
                state.embeds = importedEmbeds.map(e => ({
                    authorName: e.author?.name || "",
                    authorURL: e.author?.url || "",
                    authorIcon: e.author?.icon_url || "",
                    title: e.title || "",
                    titleURL: e.url || "",
                    description: e.description || "",
                    color: e.color ? `#${e.color.toString(16).padStart(6, '0')}` : "#5865f2",
                    thumbnail: e.thumbnail?.url || "",
                    image: e.image?.url || "",
                    footerText: e.footer?.text || "",
                    footerIcon: e.footer?.icon_url || "",
                    timestamp: !!e.timestamp,
                    fields: (e.fields || []).map(f => ({ name: f.name, value: f.value, inline: !!f.inline }))
                }));

                activeEmbedIndex = 0;
                loadEmbedToForm();
                renderTabs();
                renderPreview();
            } catch (err) {
                alert("Invalid Discohook/Discord JSON file.");
            }
        };
        reader.readAsText(file);
    };

    // Live Render Engine
    function renderPreview() {
        // Message Text
        refs.previewMessageContent.innerHTML = formatMarkdown(state.content);

        // Raw Payload JSON Code block
        const payload = buildPayload();
        refs.jsonViewer.textContent = JSON.stringify(payload, null, 2);

        // Embed Render
        refs.previewContainer.innerHTML = "";
        state.embeds.forEach(embed => {
            const card = document.createElement("div");
            card.className = "preview-embed";
            card.style.borderLeftColor = embed.color || "#5865f2";

            let html = "";
            if (embed.thumbnail) html += `<img src="${escapeHtml(embed.thumbnail)}" class="embed-thumbnail" onerror="this.style.display='none'">`;

            if (embed.authorName) {
                html += `<div class="embed-author">`;
                if (embed.authorIcon) html += `<img src="${escapeHtml(embed.authorIcon)}" onerror="this.style.display='none'">`;
                html += embed.authorURL ? `<a href="${escapeHtml(embed.authorURL)}" target="_blank">${escapeHtml(embed.authorName)}</a>` : escapeHtml(embed.authorName);
                html += `</div>`;
            }

            if (embed.title) {
                html += `<div class="embed-title">`;
                html += embed.titleURL ? `<a href="${escapeHtml(embed.titleURL)}" target="_blank">${escapeHtml(embed.title)}</a>` : escapeHtml(embed.title);
                html += `</div>`;
            }

            if (embed.description) html += `<div class="embed-description">${formatMarkdown(embed.description)}</div>`;

            if (embed.fields && embed.fields.length > 0) {
                html += `<div class="embed-fields">`;
                embed.fields.forEach(f => {
                    html += `
                        <div class="embed-field ${f.inline ? 'inline' : ''}">
                            <div class="field-name">${escapeHtml(f.name || '\u200b')}</div>
                            <div class="field-value">${formatMarkdown(f.value || '\u200b')}</div>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            if (embed.image) html += `<img src="${escapeHtml(embed.image)}" class="embed-image" onerror="this.style.display='none'">`;

            if (embed.footerText || embed.timestamp) {
                html += `<div class="embed-footer">`;
                if (embed.footerIcon) html += `<img src="${escapeHtml(embed.footerIcon)}" onerror="this.style.display='none'">`;
                let ft = escapeHtml(embed.footerText || "");
                if (embed.timestamp) ft += (ft ? " • " : "") + "Today at 12:00 PM";
                html += `<span>${ft}</span></div>`;
            }

            card.innerHTML = html;
            refs.previewContainer.appendChild(card);
        });

        // Buttons Render
        if (state.buttons.length > 0) {
            const btnContainer = document.createElement("div");
            btnContainer.className = "preview-buttons";
            state.buttons.forEach(b => {
                const btn = document.createElement("button");
                btn.className = `discord-btn ${b.style || 'secondary'}`;
                btn.textContent = b.label || "Button";
                btnContainer.appendChild(btn);
            });
            refs.previewContainer.appendChild(btnContainer);
        }
    }

    // High-fidelity Discord Markdown Formatting Engine
    function formatMarkdown(str) {
        if (!str) return "";
        
        // 1. Escape HTML special characters first to prevent XSS
        let text = escapeHtml(str);

        // 2. Multiline & Single-line Code Blocks (Processed first to avoid inner formatting)
        text = text.replace(/```(?:[a-z]+)?\n?([\s\S]*?)```/g, '<pre class="discord-code-block"><code>$1</code></pre>');
        text = text.replace(/`([^`]+)`/g, '<code class="discord-inline-code">$1</code>');

        // 3. Blockquotes (Lines starting with >)
        text = text.replace(/^&gt;\s?(.*)$/gm, '<blockquote class="discord-blockquote">$1</blockquote>');

        // 4. Text Formatting (Bold, Italic, Underline, Strikethrough, Spoiler)
        text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>'); // Bold Italic ***text***
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');          // Bold **text**
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');                      // Italic *text*
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');                        // Italic _text_
        text = text.replace(/__(.*?)__/g, '<u>$1</u>');                        // Underline __text__
        text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');                    // Strikethrough ~~text~~
        text = text.replace(/\|\|(.*?)\|\|/g, '<span class="discord-spoiler">$1</span>'); // Spoiler ||text||

        // 5. Hyperlinks [label](url)
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        return text;
    }

function escapeHtml(str) {
    return (str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

    // Initialize View
    loadEmbedToForm();
    renderTabs();
    renderPreview();
});