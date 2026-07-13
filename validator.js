const DiscordLimits = {

    embeds: 10,

    title: 256,

    description: 4096,

    footer: 2048,

    fieldName: 256,

    fieldValue: 1024,

    fields: 25,

    buttons: 5

};





function validateEmbeds(embeds){


    let errors = [];



    if(embeds.length > DiscordLimits.embeds){

        errors.push(
            "Maximum 10 embeds allowed"
        );

    }



    embeds.forEach((embed,index)=>{



        const number=index+1;



        if(embed.title.length >
        DiscordLimits.title){


            errors.push(
                `Embed ${number}: Title too long`
            );

        }



        if(embed.description.length >
        DiscordLimits.description){


            errors.push(
                `Embed ${number}: Description too long`
            );

        }




        if(embed.fields.length >
        DiscordLimits.fields){


            errors.push(
                `Embed ${number}: Too many fields`
            );

        }





        embed.fields.forEach(
        (field,fieldIndex)=>{


            if(field.name.length >
            DiscordLimits.fieldName){


                errors.push(
                `Embed ${number} Field ${fieldIndex+1}: Name too long`
                );

            }



            if(field.value.length >
            DiscordLimits.fieldValue){


                errors.push(
                `Embed ${number} Field ${fieldIndex+1}: Value too long`
                );

            }



        });



        if(embed.footer.text.length >
        DiscordLimits.footer){


            errors.push(
                `Embed ${number}: Footer too long`
            );

        }





        if(embed.buttons.length >
        DiscordLimits.buttons){


            errors.push(
                `Embed ${number}: Too many buttons`
            );

        }



    });



    return errors;

}







function showValidationErrors(errors){


    if(!errors.length){

        return true;

    }



    alert(

        "Embed errors:\n\n" +
        errors.join("\n")

    );


    return false;


}






function isValidURL(url){


    if(!url){

        return true;

    }



    try{

        new URL(url);

        return true;

    }

    catch{

        return false;

    }

}





function validateImages(embeds){


    let errors=[];



    embeds.forEach((embed,index)=>{


        if(
            embed.image &&
            !isValidURL(embed.image)
        ){

            errors.push(
                `Embed ${index+1}: Invalid image URL`
            );

        }



        if(
            embed.thumbnail &&
            !isValidURL(embed.thumbnail)
        ){

            errors.push(
                `Embed ${index+1}: Invalid thumbnail URL`
            );

        }



    });



    return errors;


}