<script>
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

    import authorKeypair from "../../store/identity";
    import shareKeypair from "../../store/share";
    import replica from "../../store/replica";
    import cacheDetails from '../../store/cache';
  
    let nextPageNumber = 0;
    let alias = $authorKeypair.address.slice(1, 5);

    const dispatch = createEventDispatcher();

    onMount(async () => {
        // Initialize page number when the component is mounted
        nextPageNumber = await fetchPages();

    });
    
    async function fetchPages() {
        const documents = $cacheDetails.queryDocs({
            filter: {
                pathStartsWith: "/documents",
            }
        });

        function extractPageNumber(path) {
            const match = path.match(/\/documents\/page(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        }

        function findNextPageNumber(docs) {
            // Filter out docs with undefined or empty text
            const validDocs = docs.filter(doc => doc.text && doc.text.trim() !== "");

            // Get page numbers from valid documents
            const pageNumbers = validDocs.map(doc => extractPageNumber(doc.path));
            
            const maxPageNumber = Math.max(...pageNumbers);
            // if no pages are found, next page is page 2, else add 1.
            return (maxPageNumber === 0) ? 2 : maxPageNumber + 1;
        }

        return findNextPageNumber(documents);
    }

    async function createNewPage() {
        let thisDoc = {
            path: `/documents/page${nextPageNumber}/newPage`,
            text: "A new page was created by " + alias,
        }
        let result = await $replica.replica.set($authorKeypair, thisDoc);
        console.log('new page result: ', result);
        dispatch('createPage');
    }
  </script>
  
  <div class="container mb-32">
    <h5>Running out of space?</h5>
    <button class='phase1 mt-8' on:click={createNewPage}>create a new page</button>
  </div>

  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

  </style>
  