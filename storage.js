const STORAGE_KEY = "fightgamer_embed_draft";





function saveDraft(){


    try{


        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify({

                embeds: embeds,

                active: activeEmbed

            })

        );


    }


    catch(error){


        console.error(
            "Failed saving draft:",
            error
        );


    }


}








function loadDraft(){


    try{


        const saved =
        localStorage.getItem(
            STORAGE_KEY
        );



        if(!saved){

            return;

        }



        const data =
        JSON.parse(saved);



        if(
            data.embeds &&
            Array.isArray(data.embeds)
        ){


            embeds =
            data.embeds;


        }



        if(
            typeof data.active === "number"
        ){


            activeEmbed =
            data.active;


        }



    }


    catch(error){


        console.error(
            "Failed loading draft:",
            error
        );


    }


}








function clearDraft(){


    localStorage.removeItem(
        STORAGE_KEY
    );


}