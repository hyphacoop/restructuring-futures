<script>
  import { onMount } from "svelte";
  import Icon from "../Artefacts/Icon.svelte";

  export let doc;
  export let index;
  export let orbitDiameter;
  export let disabled = false;

  let iconContainer;
  let replies = true;

  onMount(() => {
    let angle = Math.random() * 360;
    const speed = 1.2; // Adjust this to change the speed of rotation

    function animate() {
      if (iconContainer) {
      angle += speed;
      const radians = angle * Math.PI / 180;
      const radius = (orbitDiameter / 4) - (index * 19); // adjust as needed
      const x = Math.cos(radians) * radius;
      const y = Math.sin(radians) * radius;
      iconContainer.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(animate);
    }
  }
    animate();
  });
</script>

<div bind:this={iconContainer} class="icon-container">
  <Icon {doc} phase={index % 9} {replies} />
</div>

<style>
  .icon-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin:center;
  }
</style>
