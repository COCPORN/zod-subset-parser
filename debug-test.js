const { parseZodString } = require('./dist/zod3/index.js');

// Test the exact string that's causing issues
const problematicString = `z.object({
      path: z.string().describe('File path to read (relative to current working directory)'),
      encoding: z.enum(['utf8', 'binary', 'base64']).optional().describe('File encoding (default: utf8)'),
      startLine: z.number().optional().describe('Start line for partial reading (1-based)'),
      endLine: z.number().optional().describe('End line for partial reading (1-based)'),
      maxBytes: z.number().optional().describe('Maximum bytes to read')
    })`;

console.log('Testing problematic string:');
console.log('String length:', problematicString.length);
console.log('String content:');
console.log(JSON.stringify(problematicString));

try {
  const schema = parseZodString(problematicString);
  console.log('✅ SUCCESS: Schema parsed successfully');
  
  // Test validation
  const testData = {
    path: '/test/file.txt',
    encoding: 'utf8'
  };
  
  const result = schema.safeParse(testData);
  console.log('✅ Validation result:', result.success);
} catch (error) {
  console.log('❌ ERROR:', error.message);
  console.log('Error type:', error.constructor.name);
  console.log('Full error:', error);
}

// Test variations to isolate the issue
console.log('\n--- Testing variations ---');

// Test 1: Simple object
try {
  const simple = parseZodString('z.object({ name: z.string() })');
  console.log('✅ Simple object works');
} catch (e) {
  console.log('❌ Simple object failed:', e.message);
}

// Test 2: Object with describe
try {
  const withDescribe = parseZodString('z.object({ name: z.string().describe("test") })');
  console.log('✅ Object with describe works');
} catch (e) {
  console.log('❌ Object with describe failed:', e.message);
}

// Test 3: Object with optional
try {
  const withOptional = parseZodString('z.object({ name: z.string().optional() })');
  console.log('✅ Object with optional works');
} catch (e) {
  console.log('❌ Object with optional failed:', e.message);
}

// Test 4: Object with enum
try {
  const withEnum = parseZodString('z.object({ type: z.enum(["a", "b"]) })');
  console.log('✅ Object with enum works');
} catch (e) {
  console.log('❌ Object with enum failed:', e.message);
}
