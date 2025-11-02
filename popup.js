document.getElementById('calc').addEventListener('click', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

	const [{ result }] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			const foo = Array.from(document.querySelectorAll('[itemprop="price"]'))
				.map((el) => el.getAttribute('content'))
				.map(Number)
				.filter((n) => !isNaN(n))
			return foo.reduce((acc, curr) => acc + curr, 0)
		},
	})

	document.getElementById('result').textContent = `Sum: ${result}`
})
