Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5000/classify_image";

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            /* 
            Below is a sample response if you have two faces in an image lets say virat and roger together.
            Most of the time if there is one person in the image you will get only one element in below array
            data = [
                {
                    class: "viral_kohli",
                    class_probability: [1.05, 12.67, 22.00, 4.5, 91.56],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                },
                {
                    class: "roder_federer",
                    class_probability: [7.02, 23.7, 52.00, 6.1, 1.62],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                }
            ]
            */
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }
            let players = ["Alisson_Becker","Bernado_Silva","Cristiano_Ronaldo","Cristian_Romero","Dominik_Szoboszlai","Ederson","Erling_haaland","Frenkie_De_Jong","Gavi","Harry_Kane","Heung_Min_Son","Jamal_Musiala","James_Maddison","Joshua_Kimmich","Jude_Bellingham","Julian_Alvarez","Kevin_De_Bruyne","Leonal_Messi","Luka_Modric","Martin_Odeggard","Mohammad_Salah","Mykhailo_Mudryk","Neymar_Junior","Paulo_Dybala","Pedri","Robert_Lewandowski","Ruben_Diaz","Sergio_Ramos","Thibaut_Courtois","Toni_Kroos","Virgil_Van_Dijk","William_Saliba"];
            
            let match = null;
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }
            if (match) {
//                $("#error").hide();
//                document.getElementById("error").textContent = "Resultgetting";
                $('#error').html("Resultgetting");
//                $("#error").textContent("Resultgetting");
                $("#resultHolder").show();
                $("#divClassTable").show();
//                $("#resultHolder").html($(`[data-player="${match.class}"`));
                $("#resultHolder").html(`<div class="col card-wrapper" ><div class="card border-0"><div class="position-relative rounded-circle overflow-hidden mx-auto custom-circle-image"><img class="w-100 h-100" src="./images/${match.class}.jpeg" alt="Card image cap"></div><div class="card-body text-center mt-4"><h4 class="text-uppercase card-title">${match.class}</h4></p></div></div></div>`);
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);
                }
            }
            // dz.removeFile(file);            
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});