<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleReadManualClick() {
    dispatch('readmanual');
  }

  function handleReadManualKeydown(event) {
  if (event.key === 'Enter' || event.key === 'Space') {
    handleReadManualClick();
    event.preventDefault();  // prevent the default action for the space key (scrolling)
  }
}
</script>

<footer class='w-full'>
  <div class="footer mx-6 flex flex-row justify-between">
    <div class='flex flex-row justify-between w-1/3 ml-8'> 
      <div class='link-style' on:click={handleReadManualClick}  on:keydown={handleReadManualKeydown} tabindex="0" role="button">
        read manual
      </div>
      <div>
        <a href="https://github.com/hyphacoop/restructuring-futures/issues/new?assignees=TRIPLEDOUBLEV&labels=bug&projects=&template=bug_report.md&title="
        target="_blank" rel="noreferrer">
          report bugs
        </a>
      </div>
      <div>
        <a href="https://github.com/hyphacoop/restructuring-futures/"
        target="_blank" rel="noreferrer">
          about
        </a>
      </div>
    </div>
    <div class='mr-8'>
      built with 
        <a target="_blank" rel="noreferrer" href='https://earthstar-project.org/'>
          Earthstar
        </a>
       with the support of the 
       <a target="_blank" rel="noreferrer" href='https://canadacouncil.ca'>
        Canada Council for the Arts
      </a>
    </div>
  </div>
</footer>

<style>
    .footer {
      position: fixed;
      bottom: 0.25rem;
      left: 0;
      right: 0;
      transition: transform 1.3s ease-in-out;
      z-index: 999;
      padding: 0.75rem;
      border: 1px solid black;
      background-color:white;
    }
    a, .link-style {
      text-decoration: underline;
    }
    a:hover, .link-style:hover {
      text-underline-offset: 0.25rem;
      text-decoration-thickness: 0.125rem;
    }
  </style>
  