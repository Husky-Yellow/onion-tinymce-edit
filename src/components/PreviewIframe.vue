<template>
          <iframe
          id="onlinePreview"
          :src="iframeDomUrl"
          width="600"
          height="500"
        ></iframe>
  </template>

  <script>
    import { defineComponent, ref, computed, onMounted, nextTick, watch } from 'vue'

    export default defineComponent({
      name: 'PreviewIframe',
      props: {
        problemDetail: {
          type: Object,
          default: {}
        }
      },
      emits: ['update:show'],
      setup(props, { emit }) {
        let onlinePreview
        const env = ref('test')

        const handleClose = () => {
          emit('update:show')
        }

        const frameUrl = computed(() => {
          switch (env.value) {
            case 'test':
              return 'https://7to12-test.yangcong345.com'
            case 'stage':
              return 'https://7to12-stage.yangcong345.com'
            case 'prod':
              return 'https://7to12.yangcong345.com'
            default:
              break
          }
        })

        const iframeDomUrl = computed(() => {
          switch (env.value) {
            case 'test':
              // return 'https://7to12-test.yangcong345.com/problem-app/onlinePreview?scene=vocationSampling'
              return 'https://7to12-test.yangcong345.com/problem-app/onlinePreview'
            case 'stage':
              return 'https://7to12-stage.yangcong345.com/problem-app/onlinePreview'
            case 'prod':
              return 'https://7to12.yangcong345.com/problem-app/onlinePreview'
            default:
              break
          }
        })

        onMounted(() => {
          onlinePreview = document?.getElementById('onlinePreview')?.contentWindow
        })

        watch(
          () => props.problemDetail,
          async (newVal) => {
            if (newVal) {
              await nextTick()
              if (onlinePreview && props.problemDetail.body) {
                onlinePreview.postMessage(
                  {
                    source: 'problem',
                    problem: props.problemDetail
                  },
                  frameUrl.value
                )
              }
            }
          },
          {
            immediate: true
          }
        )

        return {
          iframeDomUrl,
          handleClose
        }
      }
    })
  </script>