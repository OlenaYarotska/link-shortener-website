import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyicon from '../icons/copy-icon.png';
import copiedicon from '../icons/copied-icon.png';
import { token } from "api/api-token";

const ShortLinkForm = ({ value, onSubmit, onChange }) => (
    <form method='post' action='' onSubmit={onSubmit} >
          <input
            type="text"
            placeholder="Paste your URL here"
            name="long_url"
            value={value}
            onChange={onChange}
            className='input'
          />
          <button
            type="submit" className='button'>Shorten URL</button>
    </form>
)

const ShortlinkResult = ({ shortLink, copy, setCopy }) => {
  const handleCopy = () => {
  setCopy(true)
  }
  return(
  <div className='hided-link'>
    <h2 className='link-heading'>Here is your short link</h2>
    <div className='link-text-wrapper'>
      <p className='text-link'>{shortLink.link}</p>
      <CopyToClipboard onCopy={handleCopy} text={shortLink.link}>
        <img
          src={copy ? copiedicon : copyicon}
          alt={copy ? 'copied icon' : 'copy icon'}
          width='20px'
          height='20px'
          onClick={handleCopy}
        />
      </CopyToClipboard>
    </div>
  </div>
  )
}


export const App = () => {
  const [longURL, setLongUrl] = useState("");
  const [shortLink, setShortLink] = useState({});
  const [active, setActive] = useState(false);
  const [copy, setCopy] = useState(false);


  const handleChange = (e) => {
    setLongUrl(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api-ssl.bitly.com/v4/shorten", {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          long_url: longURL,
          domain: "bit.ly",
        })
      })
      const data = await res.json();
      if (data && data.link) {
        const newLink = data.link.replace("https://", "");
        const response = await fetch(
          `https://api-ssl.bitly.com/v4/bitlinks/${newLink}`,
          {
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const result = await response.json();
        setShortLink(result);
        setActive(true);
      }
    } catch (error) {
    console.error('Error', error)
  }
  setLongUrl("");
};
return (
    <div className='wrapper'>
    <h1 className='heading'>Link shortener web-site</h1>
    <ShortLinkForm onSubmit={handleSubmit} onChange={handleChange} value={longURL} />
    {active && <ShortlinkResult shortLink={shortLink} setCopy={setCopy} copy={copy} />}
    </div>
  )
}
