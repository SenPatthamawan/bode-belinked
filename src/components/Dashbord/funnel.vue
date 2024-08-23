<div id="funnel"></div>

<script>
import D3Funnel from 'd3-funnel'
const data = [
  { label: 'Inquiries', value: 5000 },
  { label: 'Applicants', value: 2500 },
  { label: 'Admits', value: 500 },
  { label: 'Deposits', value: 200 }
]
const options = {
  block: {
    dynamicHeight: true,
    minHeight: 15
  }
}

const chart = new D3Funnel('#funnel')
chart.draw(data, options)
</script>
