# Changelog

<a name="1.0.2"></a>
## 1.0.2 (2021-05-13)

### Added

- ✅ Add test for new getStringFromFile [[c9d5720](https://github.com/seancrowe/clean-data-xmls/commit/c9d5720cf84242df467efcc8615aee2b59c2398a)]
- ✅ Add test for getDirectoryTree and updated tests [[3defa20](https://github.com/seancrowe/clean-data-xmls/commit/3defa20ddc55bbdbdc820827281a0f4aca23cd4e)]

### Changed

- 🎨 Updated format to match format guidelines [[c8b55ff](https://github.com/seancrowe/clean-data-xmls/commit/c8b55ff4b714cfe5043a223d3563aac1be4f47d1)]
- 🎨 Update format and removed unused imports [[061d407](https://github.com/seancrowe/clean-data-xmls/commit/061d407c4ebdf048bb0f2840f63c7a11d97ef41f)]
- 💬 Add console logs during startup [[ec288f3](https://github.com/seancrowe/clean-data-xmls/commit/ec288f350223770543b1a0ac67c7dce32d577bfb)]

### Fixed

- 🐛 Fix reading XML in UTF-16 or UCS-2 encoding [[c7f8404](https://github.com/seancrowe/clean-data-xmls/commit/c7f840487456359de2a488c4772ff40d45182177)]
- 🐛 Fix issue where directory level was incorrect [[950d41f](https://github.com/seancrowe/clean-data-xmls/commit/950d41f4954fcfe27bc3fb8f212e0b4979435fe8)]
- 🐛 Fix issue with reading directory taking long [[84cdfcd](https://github.com/seancrowe/clean-data-xmls/commit/84cdfcddc6655602c17a42ed160512157ce1a319)]

### Miscellaneous

-  Merge branch &#x27;Bug/handle-UTF-16-encoding&#x27; [[171f8f7](https://github.com/seancrowe/clean-data-xmls/commit/171f8f75316cdb9ebd904c3ccbcb55fee1481b69)]
-  Merge branch &#x27;master&#x27; into Bug/handle-UTF-16-encoding [[4231a8b](https://github.com/seancrowe/clean-data-xmls/commit/4231a8bae0d1e3f247d5658cae733c3ef00f287a)]
- 📦 Add no-try to dependencies [[92aba4a](https://github.com/seancrowe/clean-data-xmls/commit/92aba4a10ad2cb68bd3a653eba79079e6f7a4696)]
- 📦 Update packages and add chardet [[e5a04ee](https://github.com/seancrowe/clean-data-xmls/commit/e5a04ee00bb0f7c94d434928f2af04b6c97918cf)]


<a name="1.0.1"></a>
## 1.0.1 (2021-05-10)

### Added

- ✨ Add debug logging for directory items [[122717e](https://github.com/seancrowe/clean-data-xmls/commit/122717ecb67d5ff76cc03427e9b34b5e4b4399ef)]
- ✨ Add new debug wrapper to handle debug logs and the flag --debug to run the debug logic [[67b6cec](https://github.com/seancrowe/clean-data-xmls/commit/67b6cec35d618461b54657c53613d2bc13b02dc7)]

### Fixed

- 🐛 Error when XML invalid or not expected type [[f4d8435](https://github.com/seancrowe/clean-data-xmls/commit/f4d8435a88cd5a9bca6326814245a3c6da547cd8)]

### Miscellaneous

-  Merge commit &#x27;122717ecb67d5ff76cc03427e9b34b5e4b4399ef&#x27; [[7a93a88](https://github.com/seancrowe/clean-data-xmls/commit/7a93a8800b6217d2a57705d30661f540bf0d58b1)]
- 🚀 Add console log when reading source directory [[8d24848](https://github.com/seancrowe/clean-data-xmls/commit/8d248486200cc2bf62abdb63dccb46e8f2868d10)]
-  Updated README.md with warning to run this when CHILI is off [[c5b8933](https://github.com/seancrowe/clean-data-xmls/commit/c5b8933c7bad8b558146679bd6acb79c58d7c5b8)]
-  Added *.zip to github to ignore releases Cleaned up cleanProcessDataXmls.ts Updated description in package.json [[d5a03e8](https://github.com/seancrowe/clean-data-xmls/commit/d5a03e8249fe4359fe13098f3a661786c13b2e2a)]
-  Removed duplicate XMLs which would cause Jest test to fail due to the way Jest test use &quot;fake&quot; command to fake missing files. No issues would be found in real world usage. [[ec52f8d](https://github.com/seancrowe/clean-data-xmls/commit/ec52f8d21c412c7b9611e1fccaccf66dfa040d02)]


<a name="1.0.0"></a>
## 1.0.0 (2021-05-03)

### Miscellaneous

-  First commit [[3ba0884](https://github.com/seancrowe/clean-data-xmls/commit/3ba08846fc0a9d0e94c52eb5d117faf1983b2290)]


