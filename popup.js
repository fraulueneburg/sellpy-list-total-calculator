document.getElementById('calc').addEventListener('click', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

	const [{ result }] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			const listItems = Array.from(document.querySelectorAll('.item-tile-container > a:first-child'))
				.map((el) => el.getAttribute('aria-label'))
				.filter((label) => label !== null)
				.map((s) => s.match(/[\d.,]+(?= EUR)/)?.[0])

			const prices = listItems.map((str) => (str ? parseFloat(str.replace('.', '').replace(',', '.')) : NaN))

			const sum = prices.reduce((acc, curr) => acc + curr, 0)

			return {
				sumFormatted: sum.toLocaleString(undefined, { style: 'currency', currency: 'EUR' }),
				count: listItems.length,
			}
		},
	})

	document.getElementById('result').textContent = `Sum: ${result.sumFormatted} (${result.count} items on this page)`
})
