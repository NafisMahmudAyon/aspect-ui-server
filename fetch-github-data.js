// fetch-github-data.js - Fetches all component files from GitHub and saves to JSON

const fs = require("fs").promises;
const path = require("path");

const componentList = {
	accordion: {
		name: "Accordion",
		path: "Accordion",
		dependencies: ["framer-motion", "lucide-react"],
		utils: ["cn"],
		files: {
			javascript: [
				"Accordion.jsx",
				"AccordionContent.jsx",
				"AccordionItem.jsx",
				"AccordionHeader.jsx",
				"AccordionContext.jsx",
				"index.js",
			],
			typescript: [
				"Accordion.tsx",
				"AccordionContent.tsx",
				"AccordionItem.tsx",
				"AccordionHeader.tsx",
				"AccordionContext.tsx",
				"index.ts",
			],
		},
	},
	alert: {
		name: "Alert",
		path: "Alert",
		dependencies: ["lucide-react"],
		utils: ["cn"],
		files: {
			javascript: ["Alert.jsx", "index.js"],
			typescript: ["Alert.tsx", "index.ts"],
		},
	},
	avatar: {
		name: "Avatar",
		path: "Avatar",
		dependencies: ["lucide-react"],
		utils: ["cn"],
		files: {
			javascript: [
				"Avatar.jsx",
				"AvatarBadge.jsx",
				"AvatarGroup.jsx",
				"AvatarImage.jsx",
				"index.js",
			],
			typescript: [
				"Avatar.tsx",
				"AvatarBadge.tsx",
				"AvatarGroup.tsx",
				"AvatarImage.tsx",
				"index.ts",
			],
		},
	},
	"back-to-top": {
		name: "BackToTop",
		path: "BackToTop",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["BackToTop.jsx", "index.js"],
			typescript: ["BackToTop.tsx", "index.ts"],
		},
	},
	badge: {
		name: "Badge",
		path: "Badge",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Badge.jsx", "index.js"],
			typescript: ["Badge.tsx", "index.ts"],
		},
	},
	breadcrumb: {
		name: "Breadcrumb",
		path: "Breadcrumb",
		dependencies: ["lucide-react"],
		utils: ["cn"],
		files: {
			javascript: ["Breadcrumb.jsx", "BreadcrumbItem.jsx", "index.js"],
			typescript: ["Breadcrumb.tsx", "BreadcrumbItem.tsx", "index.ts"],
		},
	},
	button: {
		name: "Button",
		path: "Button",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Button.jsx", "index.js"],
			typescript: ["Button.tsx", "index.ts"],
		},
	},
	card: {
		name: "Card",
		path: "Card",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: [
				"Card.jsx",
				"CardContent.jsx",
				"CardFooter.jsx",
				"CardHeader.jsx",
				"CardTitle.jsx",
				"CardDescription.jsx",
				"index.js",
			],
			typescript: [
				"Card.tsx",
				"CardContent.tsx",
				"CardFooter.tsx",
				"CardHeader.tsx",
				"CardTitle.tsx",
				"CardDescription.tsx",
				"index.ts",
			],
		},
	},
	carousel: {
		name: "Carousel",
		path: "Carousel",
		dependencies: ["embla-carousel-react"],
		utils: ["cn"],
		files: {
			javascript: [
				"Carousel.jsx",
				"CarouselArrowButtons.jsx",
				"Control.jsx",
				"Indicators.jsx",
				"Item.jsx",
				"Slides.jsx",
				"CarouselContext.jsx",
				"CarouselDotButton.jsx",
				"Viewport.jsx",
				"index.js",
			],
			typescript: [
				"Carousel.tsx",
				"CarouselArrowButtons.tsx",
				"Control.tsx",
				"Indicators.tsx",
				"Item.tsx",
				"Slides.tsx",
				"CarouselContext.tsx",
				"CarouselDotButton.tsx",
				"Viewport.tsx",
				"index.ts",
			],
		},
	},
	checkbox: {
		name: "Checkbox",
		path: "Checkbox",
		dependencies: ["lucide-react"],
		utils: ["cn"],
		files: {
			javascript: ["Checkbox.jsx", "index.js"],
			typescript: ["Checkbox.tsx", "index.ts"],
		},
	},
	"circular-progress-bar": {
		name: "CircularProgressBar",
		path: "CircularProgressBar",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["CircularProgressBar.jsx", "index.js"],
			typescript: ["CircularProgressBar.tsx", "index.ts"],
		},
	},
	"date-picker": {
		name: "DatePicker",
		path: "DatePicker",
		dependencies: ["lucide-react"],
		components: ["dropdown", "popover"],
		utils: ["cn"],
		files: {
			javascript: ["DatePicker.jsx", "index.js"],
			typescript: ["DatePicker.tsx", "index.ts"],
		},
	},
	divider: {
		name: "Divider",
		path: "Divider",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Divider.jsx", "index.js"],
			typescript: ["Divider.tsx", "index.ts"],
		},
	},
	dropdown: {
		name: "Dropdown",
		path: "Dropdown",
		dependencies: ["lucide-react"],
		utils: ["cn"],
		files: {
			javascript: [
				"Dropdown.jsx",
				"DropdownAction.jsx",
				"DropdownContent.jsx",
				"DropdownItem.jsx",
				"DropdownList.jsx",
				"DropdownContext.jsx",
				"index.js",
			],
			typescript: [
				"Dropdown.tsx",
				"DropdownAction.tsx",
				"DropdownContent.tsx",
				"DropdownItem.tsx",
				"DropdownList.tsx",
				"DropdownContext.tsx",
				"index.ts",
			],
		},
	},
	input: {
		name: "Input",
		path: "Input",
		dependencies: ["lucide-react"],
		components: ["tooltip"],
		utils: ["cn"],
		files: {
			javascript: ["Input.jsx", "index.js"],
			typescript: ["Input.tsx", "index.ts"],
		},
	},
	masonry: {
		name: "Masonry",
		path: "Masonry",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Masonry.jsx", "index.js"],
			typescript: ["Masonry.tsx", "index.ts"],
		},
	},
	modal: {
		name: "Modal",
		path: "Modal",
		dependencies: ["framer-motion", "react-focus-lock", "react-remove-scroll"],
		utils: ["cn", "portal"],
		files: {
			javascript: [
				"Modal.jsx",
				"ModalActions.jsx",
				"ModalContent.jsx",
				"ModalContext.jsx",
				"ModalOverlay.jsx",
				"ModalPortal.jsx",
				"index.js",
			],
			typescript: [
				"Modal.tsx",
				"ModalActions.tsx",
				"ModalContent.tsx",
				"ModalContext.tsx",
				"ModalOverlay.tsx",
				"ModalPortal.tsx",
				"index.ts",
			],
		},
	},
	navbar: {
		name: "Navbar",
		path: "Navbar",
		dependencies: ["framer-motion"],
		utils: ["cn"],
		files: {
			javascript: [
				"Navbar.jsx",
				"NavbarContainer.jsx",
				"NavbarList.jsx",
				"NavbarItem.jsx",
				"NavbarCollapse.jsx",
				"NavbarCollapseBtn.jsx",
				"NavbarContext.jsx",
				"index.js",
			],
			typescript: [
				"Navbar.tsx",
				"NavbarContainer.tsx",
				"NavbarList.tsx",
				"NavbarItem.tsx",
				"NavbarCollapse.tsx",
				"NavbarCollapseBtn.tsx",
				"NavbarContext.tsx",
				"index.ts",
			],
		},
	},
	"number-counter": {
		name: "NumberCounter",
		path: "NumberCounter",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["NumberCounter.jsx", "index.js"],
			typescript: ["NumberCounter.tsx", "index.ts"],
		},
	},
	pagination: {
		name: "Pagination",
		path: "Pagination",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Pagination.jsx", "index.js"],
			typescript: ["Pagination.tsx", "index.ts"],
		},
	},
	popover: {
		name: "Popover",
		path: "Popover",
		dependencies: ["@radix-ui/react-popover"],
		utils: ["cn"],
		files: {
			javascript: ["Popover.jsx", "index.js"],
			typescript: ["Popover.tsx", "index.ts"],
		},
	},
	progressbar: {
		name: "ProgressBar",
		path: "ProgressBar",
		dependencies: ["framer-motion"],
		utils: ["cn"],
		files: {
			javascript: ["ProgressBar.jsx", "index.js"],
			typescript: ["ProgressBar.tsx", "index.ts"],
		},
	},
	radio: {
		name: "Radio",
		path: "Radio",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Radio.jsx", "index.js"],
			typescript: ["Radio.tsx", "index.ts"],
		},
	},
	rating: {
		name: "Rating",
		path: "Rating",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Rating.jsx", "index.js"],
			typescript: ["Rating.tsx", "index.ts"],
		},
	},
	sidebar: {
		name: "Sidebar",
		path: "Sidebar",
		dependencies: ["framer-motion", "lucide-react"],
		utils: ["cn"],
		files: {
			javascript: [
				"Sidebar.jsx",
				"SidebarHeader.jsx",
				"SidebarItem.jsx",
				"SidebarContainer.jsx",
				"SidebarFooter.jsx",
				"SidebarContext.jsx",
				"SidebarToggleButton.jsx",
				"index.js",
			],
			typescript: [
				"Sidebar.tsx",
				"SidebarHeader.tsx",
				"SidebarItem.tsx",
				"SidebarContainer.tsx",
				"SidebarFooter.tsx",
				"SidebarContext.tsx",
				"SidebarToggleButton.tsx",
				"index.ts",
			],
		},
	},
	skeleton: {
		name: "Skeleton",
		path: "Skeleton",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Skeleton.jsx", "index.js"],
			typescript: ["Skeleton.tsx", "index.ts"],
		},
	},
	slider: {
		name: "Slider",
		path: "Slider",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Slider.jsx", "index.js"],
			typescript: ["Slider.tsx", "index.ts"],
		},
	},
	spinner: {
		name: "Spinner",
		path: "Spinner",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Spinner.jsx", "index.js"],
			typescript: ["Spinner.tsx", "index.ts"],
		},
	},
	stepper: {
		name: "Stepper",
		path: "Stepper",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Stepper.jsx", "index.js"],
			typescript: ["Stepper.tsx", "index.ts"],
		},
	},
	switch: {
		name: "Switch",
		path: "Switch",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Switch.jsx", "index.js"],
			typescript: ["Switch.tsx", "index.ts"],
		},
	},
	table: {
		name: "Table",
		path: "Table",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: [
				"Table.jsx",
				"TableBody.jsx",
				"TableCaption.jsx",
				"TableFooter.jsx",
				"TableHeader.jsx",
				"TableHeadCell.jsx",
				"TableRow.jsx",
				"TableCell.jsx",
				"TableContext.jsx",
				"index.js",
			],
			typescript: [
				"Table.tsx",
				"TableBody.tsx",
				"TableCaption.tsx",
				"TableFooter.tsx",
				"TableHeader.tsx",
				"TableHeadCell.tsx",
				"TableRow.tsx",
				"TableCell.tsx",
				"TableContext.tsx",
				"index.ts",
			],
		},
	},
	tabs: {
		name: "Tabs",
		path: "Tabs",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: [
				"Tabs.jsx",
				"TabList.jsx",
				"TabItem.jsx",
				"TabContent.jsx",
				"TabsContext.jsx",
				"index.js",
			],
			typescript: [
				"Tabs.tsx",
				"TabList.tsx",
				"TabItem.tsx",
				"TabContent.tsx",
				"TabsContext.tsx",
				"index.ts",
			],
		},
	},
	textarea: {
		name: "Textarea",
		path: "Textarea",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Textarea.jsx", "index.js"],
			typescript: ["Textarea.tsx", "index.ts"],
		},
	},
	timeline: {
		name: "Timeline",
		path: "Timeline",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Timeline.jsx", "TimelineItem.jsx", "index.js"],
			typescript: ["Timeline.tsx", "TimelineItem.tsx", "index.ts"],
		},
	},
	toast: {
		name: "Toast",
		path: "Toast",
		dependencies: ["framer-motion"],
		utils: ["cn"],
		files: {
			javascript: ["Toast.jsx", "index.js"],
			typescript: ["Toast.tsx", "index.ts"],
		},
	},
	"toggle-button": {
		name: "ToggleButton",
		path: "ToggleButton",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: [
				"ToggleButton.jsx",
				"Toggle.jsx",
				"ToggleButtonGroup.jsx",
				"ToggleButtonGroupContext.jsx",
				"index.js",
			],
			typescript: [
				"ToggleButton.tsx",
				"Toggle.tsx",
				"ToggleButtonGroup.tsx",
				"ToggleButtonGroupContext.tsx",
				"index.ts",
			],
		},
	},
	tooltip: {
		name: "Tooltip",
		path: "Tooltip",
		dependencies: ["@radix-ui/react-tooltip"],
		utils: ["cn"],
		files: {
			javascript: ["Tooltip.jsx", "index.js"],
			typescript: ["Tooltip.tsx", "index.ts"],
		},
	},
	typography: {
		name: "Typography",
		path: "Typography",
		dependencies: [],
		utils: ["cn"],
		files: {
			javascript: ["Typography.jsx", "index.js"],
			typescript: ["Typography.tsx", "index.ts"],
		},
	},
	upload: {
		name: "Upload",
		path: "Upload",
		dependencies: ["lucide-react"],
		utils: ["cn"],
		files: {
			javascript: ["Upload.jsx", "index.js"],
			typescript: ["Upload.tsx", "index.ts"],
		},
	},
};

const utils = {
	cn: {
		name: "cn",
		path: "utils",
		dependencies: ["clsx", "tailwind-merge"],
		files: {
			javascript: ["cn.js"],
			typescript: ["cn.ts"],
		},
	},
	portal: {
		name: "Portal",
		path: "utils",
		dependencies: [],
		files: {
			javascript: ["Portal.jsx"],
			typescript: ["Portal.tsx"],
		},
	},
};

// Configuration
const BASE_GITHUB_URL =
	"https://raw.githubusercontent.com/NafisMahmudAyon/aspect-ui-components-folders";
const OUTPUT_FILE = "component-data.json";

// Helper function to add delay between requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch file content from GitHub with retry logic
async function fetchFileContent(url, retries = 3) {
	for (let i = 0; i < retries; i++) {
		try {
			console.log(`Fetching: ${url}`);
			const response = await fetch(url);

			if (!response.ok) {
				if (response.status === 404) {
					console.warn(`File not found (404): ${url}`);
					return null;
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const content = await response.text();
			console.log(`✓ Successfully fetched: ${url}`);
			return content;
		} catch (error) {
			console.error(`Attempt ${i + 1} failed for ${url}:`, error.message);
			if (i === retries - 1) {
				console.error(`Failed to fetch after ${retries} attempts: ${url}`);
				return null;
			}
			await delay(1000 * (i + 1)); // Exponential backoff
		}
	}
}

// Fetch all component files
async function fetchAllComponentFiles() {
	const allData = {
		components: {},
		utils: {},
		metadata: {
			lastUpdated: new Date().toISOString(),
			totalComponents: Object.keys(componentList).length,
			totalUtils: Object.keys(utils).length,
			githubRepo: "NafisMahmudAyon/aspect-ui-components-folders",
		},
	};

	console.log("Starting to fetch component files...\n");

	// Fetch component files
	for (const [componentId, component] of Object.entries(componentList)) {
		console.log(`\n📂 Processing component: ${componentId}`);

		allData.components[componentId] = {
			id: componentId,
			name: component.name,
			path: component.path,
			dependencies: component.dependencies,
			utils: component.utils,
			files: {},
		};

		// Fetch files for each language
		for (const [language, filenames] of Object.entries(component.files)) {
			console.log(`  📄 Language: ${language}`);
			allData.components[componentId].files[language] = [];

			for (const filename of filenames) {
				const fileUrl = `${BASE_GITHUB_URL}/${language}/components/aspect-ui/${component.path}/${filename}`;
				const content = await fetchFileContent(fileUrl);

				allData.components[componentId].files[language].push({
					filename,
					url: fileUrl,
					content:
						content || `// Error: Could not fetch content for ${filename}`,
					success: content !== null,
					size: content ? content.length : 0,
				});

				// Add delay to avoid rate limiting
				await delay(100);
			}
		}
	}

	// Fetch utility files
	console.log("\n📂 Processing utility files...");
	for (const [utilId, util] of Object.entries(utils)) {
		console.log(`\n🔧 Processing utility: ${utilId}`);

		allData.utils[utilId] = {
			id: utilId,
			name: util.name,
			path: util.path,
			dependencies: util.dependencies,
			files: {},
		};

		// Fetch files for each language
		for (const [language, filenames] of Object.entries(util.files)) {
			console.log(`  📄 Language: ${language}`);
			allData.utils[utilId].files[language] = [];

			for (const filename of filenames) {
				const fileUrl = `${BASE_GITHUB_URL}/${language}/components/${util.path}/${filename}`;
				const content = await fetchFileContent(fileUrl);

				allData.utils[utilId].files[language].push({
					filename,
					url: fileUrl,
					content:
						content || `// Error: Could not fetch content for ${filename}`,
					success: content !== null,
					size: content ? content.length : 0,
				});

				// Add delay to avoid rate limiting
				await delay(100);
			}
		}
	}

	return allData;
}

// Save data to JSON file
async function saveDataToFile(data, filename) {
	try {
		await fs.writeFile(filename, JSON.stringify(data, null, 2), "utf8");
		console.log(`\n✅ Data saved to ${filename}`);

		// Calculate and display statistics
		const stats = calculateStats(data);
		displayStats(stats);
	} catch (error) {
		console.error(`❌ Error saving data to ${filename}:`, error);
	}
}

// Calculate statistics
function calculateStats(data) {
	let totalFiles = 0;
	let successfulFiles = 0;
	let totalSize = 0;
	let languageStats = {};

	// Component files stats
	for (const component of Object.values(data.components)) {
		for (const [language, files] of Object.entries(component.files)) {
			if (!languageStats[language]) {
				languageStats[language] = { files: 0, size: 0 };
			}

			for (const file of files) {
				totalFiles++;
				if (file.success) successfulFiles++;
				totalSize += file.size;
				languageStats[language].files++;
				languageStats[language].size += file.size;
			}
		}
	}

	// Utility files stats
	for (const util of Object.values(data.utils)) {
		for (const [language, files] of Object.entries(util.files)) {
			if (!languageStats[language]) {
				languageStats[language] = { files: 0, size: 0 };
			}

			for (const file of files) {
				totalFiles++;
				if (file.success) successfulFiles++;
				totalSize += file.size;
				languageStats[language].files++;
				languageStats[language].size += file.size;
			}
		}
	}

	return {
		totalFiles,
		successfulFiles,
		failedFiles: totalFiles - successfulFiles,
		totalSize,
		languageStats,
	};
}

// Display statistics
function displayStats(stats) {
	console.log("\n📊 FETCH STATISTICS");
	console.log("==================");
	console.log(`Total files processed: ${stats.totalFiles}`);
	console.log(`Successful downloads: ${stats.successfulFiles}`);
	console.log(`Failed downloads: ${stats.failedFiles}`);
	console.log(
		`Success rate: ${((stats.successfulFiles / stats.totalFiles) * 100).toFixed(
			2
		)}%`
	);
	console.log(`Total content size: ${(stats.totalSize / 1024).toFixed(2)} KB`);

	console.log("\nLanguage breakdown:");
	for (const [language, data] of Object.entries(stats.languageStats)) {
		console.log(
			`  ${language}: ${data.files} files, ${(data.size / 1024).toFixed(2)} KB`
		);
	}
}

// Main execution function
async function main() {
	console.log("🚀 Starting GitHub data fetch process...");
	console.log(`Base URL: ${BASE_GITHUB_URL}`);
	console.log(`Output file: ${OUTPUT_FILE}\n`);

	try {
		const startTime = Date.now();

		// Fetch all data
		const allData = await fetchAllComponentFiles();

		// Save to JSON file
		await saveDataToFile(allData, OUTPUT_FILE);

		const endTime = Date.now();
		const duration = (endTime - startTime) / 1000;

		console.log(`\n🎉 Process completed in ${duration.toFixed(2)} seconds`);
		console.log(`📁 Data saved to: ${path.resolve(OUTPUT_FILE)}`);
	} catch (error) {
		console.error("❌ Fatal error during fetch process:", error);
		process.exit(1);
	}
}

// Run the script
if (require.main === module) {
	main();
}

module.exports = { fetchAllComponentFiles, saveDataToFile };
