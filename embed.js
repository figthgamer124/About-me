let embeds = [
    createEmptyEmbed()
];

let activeEmbed = 0;



function createEmptyEmbed(){

    return {

        author:{
            name:"",
            url:"",
            icon_url:""
        },

        title:"",
        title_url:"",

        description:"",

        color:"#5865F2",

        thumbnail:"",
        image:"",

        footer:{
            text:"",
            icon_url:""
        },

        timestamp:false,

        fields:[],

        buttons:[]

    };

}





const $ = id => document.getElementById(id);



function loadEditor(){

    const embed = embeds[activeEmbed];


    $("authorName").value = embed.author.name || "";

    $("authorURL").value = embed.author.url || "";

    $("authorIcon").value = embed.author.icon_url || "";


    $("title").value = embed.title || "";

    $("titleURL").value = embed.title_url || "";


    $("description").value = embed.description || "";


    $("color").value = embed.color || "#5865F2";

    $("colorHex").value = embed.color || "#5865F2";


    $("thumbnail").value = embed.thumbnail || "";

    $("image").value = embed.image || "";


    $("footerText").value = embed.footer.text || "";

    $("footerIcon").value = embed.footer.icon_url || "";


    $("timestamp").checked = embed.timestamp;


    renderFields();

    renderButtons();

    updatePreview();

}





function saveEditor(){


    const embed = embeds[activeEmbed];


    embed.author.name =
        $("authorName").value;


    embed.author.url =
        $("authorURL").value;


    embed.author.icon_url =
        $("authorIcon").value;



    embed.title =
        $("title").value;


    embed.title_url =
        $("titleURL").value;



    embed.description =
        $("description").value;



    embed.color =
        $("colorHex").value;



    embed.thumbnail =
        $("thumbnail").value;


    embed.image =
        $("image").value;



    embed.footer.text =
        $("footerText").value;


    embed.footer.icon_url =
        $("footerIcon").value;



    embed.timestamp =
        $("timestamp").checked;


    updatePreview();

    saveDraft();

}





document
.querySelectorAll(
"input,textarea"
)
.forEach(input=>{


    input.addEventListener(
        "input",
        ()=>{


            if(input.id==="color"){

                $("colorHex").value =
                    input.value;

            }


            if(input.id==="colorHex"){

                $("color").value =
                    input.value;

            }


            saveEditor();


        }
    );


});







function renderEmbedTabs(){

    const box=$("embedTabs");

    box.innerHTML="";


    embeds.forEach((embed,index)=>{


        let button=document.createElement(
            "button"
        );


        button.className =
            "embed-tab " +
            (index===activeEmbed ?
            "active":"");


        button.textContent =
            "Embed " + (index+1);



        button.onclick=()=>{

            activeEmbed=index;

            loadEditor();

            renderEmbedTabs();

        };


        box.appendChild(button);


    });

}






$("addEmbed").onclick=()=>{


    embeds.push(
        createEmptyEmbed()
    );


    activeEmbed =
        embeds.length-1;


    renderEmbedTabs();

    loadEditor();


};







$("duplicateEmbed").onclick=()=>{


    embeds.push(
        structuredClone(
            embeds[activeEmbed]
        )
    );


    activeEmbed =
        embeds.length-1;


    renderEmbedTabs();

    loadEditor();


};






$("deleteEmbed").onclick=()=>{


    if(embeds.length===1){

        embeds=[
            createEmptyEmbed()
        ];

    }
    else{


        embeds.splice(
            activeEmbed,
            1
        );


        activeEmbed=0;


    }



    renderEmbedTabs();

    loadEditor();


};







$("addField").onclick=()=>{


    embeds[activeEmbed]
    .fields
    .push({

        name:"Field name",

        value:"Field value",

        inline:false

    });



    renderFields();

    updatePreview();


};







function renderFields(){


    const box=$("fields");

    box.innerHTML="";


    embeds[activeEmbed]
    .fields
    .forEach((field,index)=>{


        let div=document.createElement(
            "div"
        );


        div.className=
        "field-editor";



        div.innerHTML=`

<input value="${field.name}"
placeholder="Field name"
>

<textarea placeholder="Field value">${field.value}</textarea>


<label>

<input type="checkbox"
${field.inline?"checked":""}
>

Inline

</label>


<button>
Remove
</button>

`;



        let inputs =
        div.querySelectorAll(
            "input,textarea"
        );



        inputs[0].oninput=e=>{

            field.name=e.target.value;

            updatePreview();

        };


        inputs[1].oninput=e=>{

            field.value=e.target.value;

            updatePreview();

        };



        inputs[2].onchange=e=>{

            field.inline=
            e.target.checked;

            updatePreview();

        };



        div.querySelector(
            "button"
        ).onclick=()=>{


            embeds[activeEmbed]
            .fields
            .splice(index,1);


            renderFields();

            updatePreview();


        };



        box.appendChild(div);


    });


}






$("addButton").onclick=()=>{


    embeds[activeEmbed]
    .buttons
    .push({

        label:"Button",

        style:"primary",

        url:""

    });


    renderButtons();

    updatePreview();


};







function renderButtons(){


    const box=$("buttons");


    box.innerHTML="";


    embeds[activeEmbed]
    .buttons
    .forEach((button,index)=>{


        let div=document.createElement(
            "div"
        );


        div.className=
        "button-editor";



        div.innerHTML=`

<input value="${button.label}"
placeholder="Label">


<input value="${button.url}"
placeholder="URL">


<select>

<option value="primary">
Primary
</option>

<option value="secondary">
Secondary
</option>

<option value="success">
Success
</option>

<option value="danger">
Danger
</option>

</select>


<button>
Remove
</button>

`;



        let inputs =
        div.querySelectorAll(
            "input,select"
        );


        inputs[0].oninput=e=>{

            button.label=e.target.value;

            updatePreview();

        };


        inputs[1].oninput=e=>{

            button.url=e.target.value;

        };


        inputs[2].onchange=e=>{

            button.style=e.target.value;

        };



        div.querySelector(
            "button"
        ).onclick=()=>{

            embeds[activeEmbed]
            .buttons.splice(index,1);

            renderButtons();

            updatePreview();

        };



        box.appendChild(div);


    });


}







function updatePreview(){


    const box=$("previewContainer");


    box.innerHTML="";


    embeds.forEach(embed=>{


        let div=document.createElement(
            "div"
        );


        div.className=
        "discord-embed";



        div.style.borderColor =
        embed.color;



        let html="";



        if(embed.author.name){

            html+=`

<div class="embed-author">

${embed.author.icon_url?
`<img src="${embed.author.icon_url}">`
:""}

${markdown(
embed.author.name
)}

</div>

`;

        }




        if(embed.title){

            html+=`

<div class="embed-title">

${markdown(embed.title)}

</div>

`;

        }



        if(embed.description){

            html+=`

<div class="embed-description">

${markdown(embed.description)}

</div>

`;

        }



        if(embed.fields.length){

            html+=`
<div class="embed-fields">
`;

            embed.fields.forEach(field=>{


                html+=`

<div class="embed-field ${field.inline?"inline-field":""}">

<b>
${markdown(field.name)}
</b>

<br>

${markdown(field.value)}

</div>

`;


            });


            html+="</div>";

        }





        if(embed.image){

            html+=`

<img class="embed-image"
src="${embed.image}">

`;

        }





        if(embed.footer.text){

            html+=`

<div class="embed-footer">

${embed.footer.text}

</div>

`;

        }



        div.innerHTML=html;


        box.appendChild(div);



    });


}






$("exportBtn").onclick=()=>{


    exportJSON(embeds);


};






$("importBtn").onclick=()=>{


    importJSON();

};






loadDraft();


renderEmbedTabs();


loadEditor();