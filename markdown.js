function markdown(text){

    if(!text){
        return "";
    }


    let output = text;


    output = output
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");



    // Code blocks

    output = output.replace(
        /```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
    );



    // Inline code

    output = output.replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
    );



    // Bold

    output = output.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );



    // Italic

    output = output.replace(
        /\*(.*?)\*/g,
        "<em>$1</em>"
    );



    // Underline

    output = output.replace(
        /__(.*?)__/g,
        "<u>$1</u>"
    );



    // Strike

    output = output.replace(
        /~~(.*?)~~/g,
        "<s>$1</s>"
    );



    // Spoiler

    output = output.replace(
        /\|\|(.*?)\|\|/g,
        "<span class='spoiler'>$1</span>"
    );



    // Block quote

    output = output.replace(
        /^> (.*)$/gm,
        "<blockquote>$1</blockquote>"
    );



    // Links

    output = output.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
        "<a href='$2'>$1</a>"
    );



    // Discord emoji

    output = output.replace(
        /:([a-zA-Z0-9_]+):/g,
        ":$1:"
    );



    // New lines

    output = output.replace(
        /\n/g,
        "<br>"
    );



    return output;

}