function convertToDiscordJSON(embeds){


    return {

        embeds: embeds.map(embed=>{


            let result = {};



            if(embed.title){

                result.title =
                embed.title;

            }



            if(embed.title_url){

                result.url =
                embed.title_url;

            }



            if(embed.description){

                result.description =
                embed.description;

            }



            if(embed.color){


                result.color =
                parseInt(
                    embed.color.replace("#",""),
                    16
                );


            }




            if(
                embed.author &&
                embed.author.name
            ){


                result.author={

                    name:
                    embed.author.name

                };



                if(embed.author.url){

                    result.author.url =
                    embed.author.url;

                }



                if(embed.author.icon_url){

                    result.author.icon_url =
                    embed.author.icon_url;

                }


            }






            if(embed.thumbnail){

                result.thumbnail={

                    url:
                    embed.thumbnail

                };

            }





            if(embed.image){

                result.image={

                    url:
                    embed.image

                };

            }





            if(
                embed.footer &&
                embed.footer.text
            ){


                result.footer={

                    text:
                    embed.footer.text

                };



                if(embed.footer.icon_url){


                    result.footer.icon_url =
                    embed.footer.icon_url;


                }


            }





            if(embed.timestamp){

                result.timestamp =
                new Date().toISOString();

            }






            if(embed.fields.length){


                result.fields =
                embed.fields.map(field=>({


                    name:
                    field.name,


                    value:
                    field.value,


                    inline:
                    field.inline


                }));


            }






            return result;


        })

    };


}








function exportJSON(embeds){



    const errors =
    validateEmbeds(embeds);



    if(
        !showValidationErrors(errors)
    ){

        return;

    }




    const data =
    convertToDiscordJSON(embeds);




    const text =
    JSON.stringify(
        data,
        null,
        4
    );




    navigator.clipboard.writeText(
        text
    );



    document
    .getElementById(
        "jsonOutput"
    )
    .value=text;



    alert(
        "JSON copied to clipboard"
    );


}








function downloadJSON(){



    const data =
    convertToDiscordJSON(
        embeds
    );



    const blob =
    new Blob(

        [
            JSON.stringify(
                data,
                null,
                4
            )
        ],

        {
            type:
            "application/json"
        }

    );



    const url =
    URL.createObjectURL(
        blob
    );



    const a =
    document.createElement(
        "a"
    );



    a.href=url;


    a.download =
    "discord-embed.json";


    a.click();



    URL.revokeObjectURL(
        url
    );


}








function importJSON(){


    document
    .getElementById(
        "jsonFile"
    )
    .click();


}







document
.getElementById(
    "jsonFile"
)
.addEventListener(
"change",
event=>{


    const file =
    event.target.files[0];


    if(!file){

        return;

    }




    const reader =
    new FileReader();




    reader.onload =
    e=>{


        try{


            const data =
            JSON.parse(
                e.target.result
            );



            if(
                data.embeds &&
                Array.isArray(data.embeds)
            ){


                embeds =
                data.embeds.map(embed=>({


                    author:
                    embed.author || {
                        name:"",
                        url:"",
                        icon_url:""
                    },


                    title:
                    embed.title || "",


                    title_url:
                    embed.url || "",


                    description:
                    embed.description || "",


                    color:
                    "#" +
                    (
                    embed.color || 5793266
                    )
                    .toString(16)
                    .padStart(6,"0"),



                    thumbnail:
                    embed.thumbnail?.url || "",


                    image:
                    embed.image?.url || "",



                    footer:
                    embed.footer || {
                        text:"",
                        icon_url:""
                    },



                    timestamp:
                    !!embed.timestamp,



                    fields:
                    embed.fields || [],


                    buttons:
                    []



                }));



                activeEmbed=0;


                renderEmbedTabs();

                loadEditor();



                alert(
                    "Imported successfully"
                );


            }


        }


        catch(error){


            alert(
                "Invalid JSON file"
            );


        }



    };



    reader.readAsText(file);



});