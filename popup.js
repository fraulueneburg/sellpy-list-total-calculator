document.getElementById('calc').addEventListener('click', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

	const [{ result }] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			const listItems = Array.from(document.querySelectorAll('[itemprop="price"]'))
				.map((el) => el.getAttribute('content'))
				.map(Number)
				.filter((n) => !isNaN(n))

			const sum = listItems.reduce((acc, curr) => acc + curr, 0)
			return {
				sumFormatted: sum.toLocaleString(undefined, { style: 'currency', currency: 'EUR' }),
				count: listItems.length,
			}
		},
	})

	document.getElementById('result').textContent = `Sum: ${result.sumFormatted} (${result.count} items)`
})
