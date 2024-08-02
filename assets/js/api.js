const apiUrl = "https://mp3quran.net/api/v3";
const lang = "ar";

async function getReciters(){
    const chooseReciter = document.getElementById("chooseReciter");
    const res = await fetch(`${apiUrl}/reciters?language=${lang}`);
    const data = await res.json();
    
    chooseReciter.innerHTML = `<option value="">اختر قارئ</option>` 

    data.reciters.forEach(reciter => {
        chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>` })
        chooseReciter.addEventListener("change",  e => getMoshaf(e.target.value));
}
getReciters()

async function getMoshaf(reciter) {
    const chooseMoshaf = document.getElementById("chooseMoshaf");
    
    const res = await fetch(`${apiUrl}/reciters?language=${lang}&reciter=${reciter}`);
    const data = await res.json();
    const moshafs = data.reciters[0].moshaf
    chooseMoshaf.innerHTML = `<option value="">اختر رواية</option>` 

    moshafs.forEach( moshaf => {
        chooseMoshaf.innerHTML += `<option value="${moshaf.id}"
        data-server="${moshaf.server}"
        data-surahlist="${moshaf.surah_list}">
        ${moshaf.name}</option>` })
       

        
        chooseMoshaf.addEventListener("change",  e => {
            const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex]
           
        const surahServer = selectedMoshaf.dataset.server;
        const surahList = selectedMoshaf.dataset.surahlist;
         getSurah(surahServer,surahList)
        });

}

async function getSurah(surahServer,surahList){
    const chooseSurah = document.getElementById("chooseSurah")
    const res = await fetch(`https://mp3quran.net/api/v3/suwar`);
    const data = await res.json();
    const surahNames = data.suwar
    surahList = surahList.split(",")
    chooseSurah.innerHTML = `<option value="">اختر سورة</option>` 

    surahList.forEach(surah =>{
        const surahPad = surah.padStart(3,'0')
        surahNames.forEach(surahName =>{
            if (surahName.id == surah){
                chooseSurah.innerHTML += `<option value="${surahServer}${surahPad}.mp3"> ${surahName.name}</option>` }  }) })
                chooseSurah.addEventListener("change",  e => {
                    const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]
                    playSurah(selectedSurah.value)
                   
            
                });
    
}

function playSurah(surahMp3){
    const audioPlayer = document.getElementById("audioplayer")
    audioPlayer.src = surahMp3
    audioPlayer.play()
}
function playLive(channel){
    if(Hls.isSupported()) {
        var video = document.getElementById('video');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
     }
}