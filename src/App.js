import './App.css';
import {Container} from "@mui/material";
import {useState} from "react";
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

function rtp(text) {
  const match = text.match(new RegExp(`[^a-zA-Z0-9]+$`));
  // No match found
  if (!match || !match.index) {
    return text;
  }
  // Return sliced text
  return text.slice(0, match.index);
}


function App() {
  const defaultCriteria = {
    'technical implementation': [
      {
        'description': '"+" instead of template literals used to concatenate string',
      },
      {
        'description': 'used function syntax instead of arrow function',
      },
      {
        'description': 'a more efficient approach to a solution was presented in class',

      },
      {
        'description': 'a `let` that could have been a `const`',
      },
      {
        'description': 'used `var`',
      },
      {
        'description': 'was possible to use implicit return of arrow function'
      },
      {
        'description': 'event listener could have used anonymous callback'
      },
      {
        'description': 'something other than querySelector/querySelectorAll used to retrieve elements'
      }
    ],
    'style': [
      {
        'description': 'passes tests but not in way '
      },
      {
        'description': 'files were changed outside of those specified by the assignment'
      },
      {
        'description': `Regarding 👆 it is ok if package-lock.json changes, that could happen on local installs`,
      },
      {
        'description': `unused code that wasn't cleaned up`
      },
      {
        'description': `commented-out code that should have been removed`
      },
      {
        'description': `pasted in snippet that was not refactored to match the overall assignment style`
      },
      {
        'description': `comment that references something that does not exist in this assignment`
      },
      {
        'description': `work brought in from another assignment that still references that prior assignment`,
      }
    ],
  }

  const theTestData = localStorage.getItem('grading-criteria') ? JSON.parse(localStorage.getItem('grading-criteria')) : defaultCriteria;
  const [testData, setTestData] = useState(theTestData);
  const [toPaste, setToPaste] = useState({});
  const [pasteString, setPasteString] = useState('');


  const updateToPaste = (description, section, checked) => {
    const toPasteClone = toPaste;
    if (checked) {
      if (!toPasteClone[section]) {
        toPasteClone[section] = [];
      }
      toPasteClone[section].push(description);
    } else if (toPasteClone[section]) {
      const index = toPasteClone[section].indexOf(description);
      if (index > -1) {
        toPasteClone[section].splice(index, 1); // 2nd parameter means remove one item only
      }
      if (toPasteClone[section].length === 0) {
        delete toPasteClone[section];
      }
    }
    setToPaste(toPasteClone);

    const cap = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let output = '';
    Object.keys(toPasteClone).forEach(section => {
      output += `${section.toUpperCase()}: ${cap(toPasteClone[section].join(', ').trim())}. `;
    })
    setPasteString(output.trim());
  }


  const dataForm = () => {
    const output = [];
    Object.keys(testData).forEach((item, index) => {
      output.push(<Question key={index} updateToPaste={updateToPaste}  testData={testData} section={item} setTestData={setTestData} toPaste={toPaste}/>)
    });
    return output;
  }



  return (
    <Container maxWidth="lg">
      <header>
        <h1>Do grades based on <a href='https://observablehq.com/@benm/syntax-style-that-will-impact-your-grade'>These Requirements</a></h1>
      </header>
      {pasteString && <h4>Paste this in:</h4>}
      {pasteString}
      <hr />
      {dataForm()}
    </Container>
  );
}

export default App;

const Question = ({testData, section, updateToPaste, setTestData, toPaste}) => {
  const [custom, setCustom] = useState('');
  const showItems = () => {
    return testData[section].map((item, index) =>
      <FormControlLabel key={index} control={<Checkbox
        onChange={(e) => updateToPaste(item.description, section, e.target.checked)}  />}
                        label={item.description}
                        checked={(toPaste[section] && toPaste[section].indexOf(item.description) !== -1) ? true : false}
      />
    );
  }

  const low = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }


  const addCustom = () => {
    updateToPaste(rtp(low(custom)), section, true);
    setCustom('');
  }

  const addCustomAndSave = () => {
    setTestData((prior) => {
      if(!prior[section]) {
        prior[section] = [];
      }
      prior[section].push({description: rtp(low(custom))});
      localStorage.setItem('grading-criteria', JSON.stringify(prior));
      return {...prior};
    });
    addCustom();
  }

  return(
    <Box>
      <h2>{section}</h2>
      <FormGroup>
        {showItems()}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Custom Item"
              variant="standard"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" onClick={addCustom}>Add</Button>
          </Grid>
          <Grid item xs={3}>
            <Button variant="outlined" onClick={addCustomAndSave}>Add + save</Button>
          </Grid>

        </Grid>

      </FormGroup>

    </Box>)
}
