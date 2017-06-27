var TREZOR_SIZE = {
    w: 102,
    h: 102,
    d: 13
};

(function(){

    var trezors = $('#trezors');
    var checkbox = $('#vertical');
    var colsLabel = $('#cols_label');
    var rowsLabel = $('#rows_label');
    var depthLabel = $('#z_label');
    var rows = $('#rows');
    var cols = $('#cols');
    var depths = $('#depths');
    var result = $('.result');
    var DEPTH_RATIO = TREZOR_SIZE.d / TREZOR_SIZE.w;


    trezors.on('input', function(){
        calculate();
    });

    rows.on('input', function(){
        calculate();
    });
    rowsLabel.text(rows.val());

    cols.on('input', function(){
        calculate();
    });
    colsLabel.text(cols.val());

    checkbox.on('change', function(){
        calculate();
    });



    function calculate(){

        if(checkbox.prop('checked')){
            calculateVertical();
            return;
        }

        depths.hide();
        rowsLabel.text(rows.val());
        colsLabel.text(cols.val());

        var valR = rows.val(),
            valC = cols.val();

        var x, y, z, i = 0;

        x = TREZOR_SIZE.w * valR;
        y = TREZOR_SIZE.h * valC;
        z = Math.round(trezors.val() / valR / valC );

        
        layout.scene.aspectratio.x = valC;
        layout.scene.aspectratio.y = valR;
        layout.scene.aspectratio.z = Math.min( valR * DEPTH_RATIO, valC * DEPTH_RATIO, DEPTH_RATIO ) * z;

        layout.scene.zaxis.range = [0, z];
        layout.scene.zaxis.tickvals = [];
        for(i = 0; i < z; i++){
            layout.scene.zaxis.tickvals.push(i + 1);
        }

        depthLabel.find('span').text(z);


        
        layout.scene.yaxis.range = [0, valR];
        layout.scene.yaxis.tickvals = [];
        for(i = 0; i < valR; i++){
            layout.scene.yaxis.tickvals.push(i + 1);
        }

        //layout.scene.aspectratio.x = valC;
        layout.scene.xaxis.range = [0, valC];
        layout.scene.xaxis.tickvals = [];
        for(i = 0; i < valC; i++){
            layout.scene.xaxis.tickvals.push(i + 1);
        }

        result.html('Rozměry: ' + (TREZOR_SIZE.w * valR) + ' x ' + (TREZOR_SIZE.h * valC) + ' x ' + (TREZOR_SIZE.d * z) + ' mm');

        Plotly.redraw('visualisation');
    }

    function calculateVertical(){

        depths.show();

        rowsLabel.text(rows.val());
        colsLabel.text(cols.val());
        //depthLabel.find('span').text(z);

        var valR = rows.val(),
            valC = cols.val();

        var x, y, z, i = 0;

        
        y = TREZOR_SIZE.h * valR;
        z = TREZOR_SIZE.w * valC;
        x = Math.round(trezors.val() / valR / valC );


        layout.scene.zaxis.range = [0, valC];
        layout.scene.zaxis.tickvals = [];
        layout.scene.aspectratio.z = valC;
        for(i = 0; i < z; i++){
            layout.scene.zaxis.tickvals.push(i + 1);
        }

        layout.scene.xaxis.range = [0, x];
        layout.scene.xaxis.tickvals = [];
        for(i = 0; i < x; i++){
            layout.scene.xaxis.tickvals.push(i + 1);
        }

        layout.scene.yaxis.range = [0, valR];
        layout.scene.yaxis.tickvals = [];
        for(i = 0; i < valR; i++){
            layout.scene.yaxis.tickvals.push(i + 1);
        }

        Plotly.redraw('visualisation');

        console.log("VERT", valC, valR, z)
    }



    var data = [
        {
            opacity:0.4,
            type: 'scatter3d',
            x: 1,
            y: 1,
            z: TREZOR_SIZE.d / TREZOR_SIZE.w,
        }
    ];
    var layout = {
        scene:{
            aspectmode: "manual", 
            aspectratio: { 
                x: 1, 
                y: 1,
                z: 1,
            }, 
            xaxis: {
                nticks: 2,
                range: [0, 1],
                showticklabels: false,
                title: 'délka'
            },
            yaxis: {
                nticks: 2,
                range: [0, 1],
                showticklabels: false,
                title: 'šířka'
            },
            zaxis: {
                nticks: 2,
                range: [0, 1],
                showticklabels: false,
                title: 'výška'
            }
        },
        autosize: true,
        width: 500,
        height: 350,
        margin: {
            l: 0,
            r: 0,
            b: 50,
            t: 50,
            pad: 4
        },

        
    };
    Plotly.newPlot('visualisation', data, layout, {
        modeBarButtonsToRemove: [
            'toImage',
            'hoverClosestCartesian',
            'resetCameraLastSave3d',
            'tableRotation',
            'sendDataToCloud',
        ]
    }); //, { displayModeBar: false }

    calculate();

})();