<script>
  import Application from "./Application.svelte";
</script>

<Application id="music" className="bg-black/70 backdrop-blur-[67px]">
  <iframe
    title="Dockyard's House Playlist"
    width="100%"
    height="450"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2052985575&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
  ></iframe>
  <div
    style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"
  >
    <a
      href="https://soundcloud.com/ganesh-g-159259464"
      title="Ganesh G"
      target="_blank"
      style="color: #cccccc; text-decoration: none;">Ganesh G</a
    >
    ·
    <a
      href="https://soundcloud.com/ganesh-g-159259464/sets/dockyards-house-playlist"
      title="Dockyard&#x27;s House Playlist"
      target="_blank"
      style="color: #cccccc; text-decoration: none;"
      >Dockyard&#x27;s House Playlist</a
    >
  </div>
</Application>
